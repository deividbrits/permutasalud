import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import { db } from '../config/firebase';
import { getRegionByComuna } from '../data/comunas';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Transporter will be instantiated when needed
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL || "contacto.permutasalud@gmail.com",
        pass: process.env.GMAIL_PASSWORD || "",
      },
    });
  }
  return transporter;
}

const router = express.Router();
const usersRef = db.collection('users');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Whitelist of fields a regular user can store inside profileData
const ALLOWED_PROFILE_FIELDS = new Set([
  'categoriaProfesional', 'profesion', 'comunaActual', 'centroSaludActual',
  'flexibilidadDestino', 'comunaDestino_1', 'comunaDestino_2', 'comunaDestino_3',
  'comunaDestino_4', 'comunaDestino_5', 'regionDestino_1', 'regionDestino_2',
  'regionDestino_3', 'bio', 'profileImage', 'isDraft',
]);

// Middlewares de Seguridad
const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      const userDoc = await usersRef.doc(decoded.id).get();
      if (!userDoc.exists) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      const userData = userDoc.data();
      req.user = { 
        id: decoded.id, 
        isAdmin: userData?.email === 'dabrito.dw24@gmail.com' || userData?.isAdmin === true,
        email: userData?.email
      };
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('No tienes permisos de administrador');
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, profession, password, rut, phone } = req.body;

  // --- Input Validation ---
  if (!firstName || !lastName || !email || !profession || !password) {
    res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    return;
  }
  // --- End Validation ---

  // Check if user exists
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (!snapshot.empty) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    rut: rut || '',
    phone: phone || '',
    email: email.toLowerCase().trim(),
    profession,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const docRef = await usersRef.add(newUser);

  // Exclude password from the response
     delete (newUser as any).password;

  res.status(201).json({
    id: docRef.id,
    ...newUser,
    token: generateToken(docRef.id),
  });
}));

// @desc    Authenticate user
// @route   POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  // Compare passwords
  const isMatch = await bcrypt.compare(password, userData.password);
  
  if (isMatch) {
    const isAdmin = userData.email === 'dabrito.dw24@gmail.com' || userData.isAdmin === true;
    res.json({
      id: userDoc.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      profession: userData.profession,
      isVerified: userData.isVerified || false,
      isAdmin,
      needsProfileCompletion: !userData.rut || !userData.profession,
      token: generateToken(userDoc.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// Helper function to generate JWT (expires in 2 hours)
const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET as string, {
    expiresIn: '2h',
  });
};

// @desc    Social Login (Google/Microsoft) — verifies Firebase ID token
// @route   POST /api/auth/social-login
router.post('/social-login', asyncHandler(async (req, res) => {
  const { idToken, provider } = req.body;

  if (!idToken) {
    res.status(400).json({ message: 'Se requiere un token de identidad válido del proveedor.' });
    return;
  }

  // Verify the Firebase ID token with Firebase Admin SDK
  let decodedToken: admin.auth.DecodedIdToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    return;
  }

  const { email, name } = decodedToken;
  if (!email) {
    res.status(400).json({ message: 'No se pudo obtener el correo del proveedor.' });
    return;
  }

  const nameParts = (name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Find user
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  
  let userId = '';
  let userData: any = {};

  if (snapshot.empty) {
    // Create new user
    const newUser = {
      firstName,
      lastName,
      email,
      provider: provider || 'social',
      isVerified: false,
      createdAt: new Date(),
      password: '', // No password for social login
    };
    const docRef = await usersRef.add(newUser);
    userId = docRef.id;
    userData = newUser;
  } else {
    // Existing user
    const userDoc = snapshot.docs[0];
    userId = userDoc.id;
    userData = userDoc.data();
  }

  const isAdmin = userData.email === 'dabrito.dw24@gmail.com' || userData.isAdmin === true;

  res.json({
    id: userId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    profession: userData.profession || '',
    isVerified: userData.isVerified || false,
    isAdmin,
    needsProfileCompletion: !userData.rut || !userData.profession,
    token: generateToken(userId),
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(async (req: any, res: any) => {
  const { userId, firstName, lastName, email, rut, phone, ...profileData } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'Se requiere iniciar sesión para guardar el perfil.' });
    return;
  }
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado para modificar este perfil' });
    return;
  }

  // Find user and update
  const userDocRef = usersRef.doc(userId);
  const doc = await userDocRef.get();
  
  if (!doc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  const updates: any = { profileUpdatedAt: new Date() };
  if (firstName !== undefined) updates.firstName = firstName.trim();
  if (lastName !== undefined) updates.lastName = lastName.trim();
  if (rut !== undefined) updates.rut = rut;
  if (phone !== undefined) updates.phone = phone;
  // Note: email changes are intentionally excluded — requires separate verified flow

  if (Object.keys(profileData).length > 0) {
    const existingData = doc.data()?.profileData || {};
    // Only allow whitelisted keys to prevent privilege escalation
    const sanitizedData: any = {};
    for (const key of Object.keys(profileData)) {
      if (ALLOWED_PROFILE_FIELDS.has(key)) {
        sanitizedData[key] = profileData[key];
      }
    }
    updates.profileData = { ...existingData, ...sanitizedData };
  }

  await userDocRef.update(updates);

  // Lógica de Matches: Revisar y notificar en segundo plano
  const updatedDoc = await userDocRef.get();
  checkAndNotifyMatches(userId, updatedDoc.data()).catch(console.error);

  res.json({ message: 'Profile updated successfully' });
}));

// Helper function to check matches and send emails
async function checkAndNotifyMatches(userId: string, updatedUserData: any) {
  const profileA = updatedUserData?.profileData;
  if (!profileA || !profileA.comunaActual || !profileA.categoriaProfesional) return;

  const allUsersSnapshot = await usersRef.get();
  
  const notifiedMatchesA = updatedUserData.notifiedMatches || [];
  let newMatchesForA = false;

  for (const doc of allUsersSnapshot.docs) {
    if (doc.id === userId) continue;
    
    const targetData = doc.data() as any;
    const profileB = targetData.profileData;
    
    if (!profileB || !profileB.comunaActual || !profileB.categoriaProfesional) continue;
    if (notifiedMatchesA.includes(doc.id)) continue;

    const catA = profileA.categoriaProfesional.split(' ')[1] || profileA.categoriaProfesional;
    const catB = profileB.categoriaProfesional.split(' ')[1] || profileB.categoriaProfesional;
    if (catA !== catB) continue;
    
    const profA = (profileA.profesion || updatedUserData.profession || '').toLowerCase().trim();
    const profB = (profileB.profesion || targetData.profession || '').toLowerCase().trim();
    if (profA !== profB) continue;

    let B_satisfies_A = false;
    if (profileA.flexibilidadDestino === 'cualquiera') {
      B_satisfies_A = true;
    } else if (profileA.flexibilidadDestino === 'regiones') {
      const regionB = getRegionByComuna(profileB.comunaActual);
      const aRegiones = [profileA.regionDestino_1, profileA.regionDestino_2, profileA.regionDestino_3]
        .filter(Boolean).map(s => s?.toLowerCase().trim());
      if (regionB && aRegiones.includes(regionB.toLowerCase().trim())) B_satisfies_A = true;
    } else {
      const aComunas = [profileA.comunaDestino_1, profileA.comunaDestino_2, profileA.comunaDestino_3, profileA.comunaDestino_4, profileA.comunaDestino_5]
        .filter(Boolean).map(s => s?.toLowerCase().trim());
      if (aComunas.includes((profileB.comunaActual || '').toLowerCase().trim())) B_satisfies_A = true;
    }

    if (!B_satisfies_A) continue;

    let A_satisfies_B = false;
    if (profileB.flexibilidadDestino === 'cualquiera') {
      A_satisfies_B = true;
    } else if (profileB.flexibilidadDestino === 'regiones') {
      const regionA = getRegionByComuna(profileA.comunaActual);
      const bRegiones = [profileB.regionDestino_1, profileB.regionDestino_2, profileB.regionDestino_3]
        .filter(Boolean).map(s => s?.toLowerCase().trim());
      if (regionA && bRegiones.includes(regionA.toLowerCase().trim())) A_satisfies_B = true;
    } else {
      const bComunas = [profileB.comunaDestino_1, profileB.comunaDestino_2, profileB.comunaDestino_3, profileB.comunaDestino_4, profileB.comunaDestino_5]
        .filter(Boolean).map(s => s?.toLowerCase().trim());
      if (bComunas.includes((profileA.comunaActual || '').toLowerCase().trim())) A_satisfies_B = true;
    }

    if (B_satisfies_A && A_satisfies_B) {
      notifiedMatchesA.push(doc.id);
      newMatchesForA = true;

      const notifiedMatchesB = targetData.notifiedMatches || [];
      if (!notifiedMatchesB.includes(userId)) {
        notifiedMatchesB.push(userId);
        await usersRef.doc(doc.id).update({ notifiedMatches: notifiedMatchesB });
      }

      if (updatedUserData.email) {
        await getTransporter().sendMail({
          from: `"PermutaSalud" <contacto.permutasalud@gmail.com>`,
          to: updatedUserData.email,
          subject: "¡Hemos encontrado un Match para tu permuta! 🤝",
          html: `<h2>¡Felicidades ${updatedUserData.firstName || ''}!</h2><p>Hemos encontrado a un profesional compatible con tus preferencias de traslado: <b>${targetData.firstName} ${targetData.lastName}</b>.</p><p>Ingresa a tu cuenta de PermutaSalud para ver los detalles de tu match y ponerse en contacto.</p><br><p>Éxito en tu proceso,<br>El equipo de PermutaSalud</p>`,
        }).catch(console.error);
      }

      if (targetData.email) {
        await getTransporter().sendMail({
          from: `"PermutaSalud" <contacto.permutasalud@gmail.com>`,
          to: targetData.email,
          subject: "¡Hemos encontrado un Match para tu permuta! 🤝",
          html: `<h2>¡Felicidades ${targetData.firstName || ''}!</h2><p>Hemos encontrado a un profesional compatible con tus preferencias de traslado: <b>${updatedUserData.firstName} ${updatedUserData.lastName}</b>.</p><p>Ingresa a tu cuenta de PermutaSalud para ver los detalles de tu match y ponerse en contacto.</p><br><p>Éxito en tu proceso,<br>El equipo de PermutaSalud</p>`,
        }).catch(console.error);
      }
    }
  }

  if (newMatchesForA) {
    await usersRef.doc(userId).update({ notifiedMatches: notifiedMatchesA });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile/:id
router.get('/profile/:id', protect, asyncHandler(async (req: any, res: any) => {
  const userId = req.params.id;
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado para ver este perfil' });
    return;
  }
  
  const userDocRef = usersRef.doc(userId);
  const doc = await userDocRef.get();
  
  if (!doc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  
  const userData = doc.data();
  if (userData) {
    delete userData.password;
  }
  
  res.json(userData);
}));

// @desc    Delete user account
// @route   DELETE /api/auth/profile/:id
router.delete('/profile/:id', protect, asyncHandler(async (req: any, res: any) => {
  const userId = req.params.id;
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado para eliminar este perfil' });
    return;
  }
  
  const userDocRef = usersRef.doc(userId);
  const doc = await userDocRef.get();
  
  if (!doc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  
  await userDocRef.delete();
  res.json({ message: 'Cuenta eliminada exitosamente' });
}));

// @desc    Get potential candidates for a user (Dashboard)
// @route   GET /api/auth/candidates/:id
router.get('/candidates/:id', protect, asyncHandler(async (req: any, res: any) => {
  const userId = req.params.id;
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado' });
    return;
  }
  
  const userDocRef = usersRef.doc(userId);
  const userDoc = await userDocRef.get();
  
  if (!userDoc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  
  const userData = userDoc.data() as any;
  const profileA = userData.profileData;
  const savedMatches = userData.savedMatches || [];
  const passedMatches = userData.passedMatches || [];
  
  if (!profileA || !profileA.comunaActual || !profileA.categoriaProfesional) {
    res.json([]);
    return;
  }

  // Get all users
  const allUsersSnapshot = await usersRef.get();
  const candidates = [];

  for (const doc of allUsersSnapshot.docs) {
    if (doc.id === userId) continue;
    // Skip if already interacted
    if (savedMatches.includes(doc.id) || passedMatches.includes(doc.id)) continue;
    
    const targetData = doc.data() as any;
    const profileB = targetData.profileData;
    
    if (!profileB || !profileB.comunaActual || !profileB.categoriaProfesional) continue;
    
    // STRICT FILTER: Category and Profession
    const catA = profileA.categoriaProfesional.split(' ')[1] || profileA.categoriaProfesional;
    const catB = profileB.categoriaProfesional.split(' ')[1] || profileB.categoriaProfesional;
    if (catA !== catB) continue;
    
    const profA = (profileA.profesion || userData.profession || '').toLowerCase().trim();
    const profB = (profileB.profesion || targetData.profession || '').toLowerCase().trim();
    if (profA !== profB) continue;

    // Evaluate A's condition on B
    let B_satisfies_A = false;
    if (profileA.flexibilidadDestino === 'cualquiera') {
      B_satisfies_A = true;
    } else if (profileA.flexibilidadDestino === 'regiones') {
      const regionB = getRegionByComuna(profileB.comunaActual);
      const aRegiones = [profileA.regionDestino_1, profileA.regionDestino_2, profileA.regionDestino_3]
        .filter(Boolean).map(s => s.toLowerCase().trim());
      if (regionB && aRegiones.includes(regionB.toLowerCase().trim())) B_satisfies_A = true;
    } else {
      // comunas
      const aComunas = [profileA.comunaDestino_1, profileA.comunaDestino_2, profileA.comunaDestino_3, profileA.comunaDestino_4, profileA.comunaDestino_5]
        .filter(Boolean).map(s => s.toLowerCase().trim());
      if (aComunas.includes((profileB.comunaActual || '').toLowerCase().trim())) B_satisfies_A = true;
    }

    if (!B_satisfies_A) continue;

    // Evaluate B's condition on A
    let A_satisfies_B = false;
    if (profileB.flexibilidadDestino === 'cualquiera') {
      A_satisfies_B = true;
    } else if (profileB.flexibilidadDestino === 'regiones') {
      const regionA = getRegionByComuna(profileA.comunaActual);
      const bRegiones = [profileB.regionDestino_1, profileB.regionDestino_2, profileB.regionDestino_3]
        .filter(Boolean).map(s => s.toLowerCase().trim());
      if (regionA && bRegiones.includes(regionA.toLowerCase().trim())) A_satisfies_B = true;
    } else {
      // comunas
      const bComunas = [profileB.comunaDestino_1, profileB.comunaDestino_2, profileB.comunaDestino_3, profileB.comunaDestino_4, profileB.comunaDestino_5]
        .filter(Boolean).map(s => s.toLowerCase().trim());
      if (bComunas.includes((profileA.comunaActual || '').toLowerCase().trim())) A_satisfies_B = true;
    }

    if (B_satisfies_A && A_satisfies_B) {
      candidates.push({
        id: doc.id,
        name: `${targetData.firstName} ${targetData.lastName}`,
        email: targetData.email,
        phone: targetData.phone || profileB.phone || 'No especificado',
        role: profileB.categoriaProfesional,
        specialty: profileB.profesion || targetData.profession,
        actual: profileB.comunaActual,
        centroActual: profileB.centroSaludActual || 'Centro de Salud no especificado',
        desired: profileB.flexibilidadDestino === 'cualquiera' ? 'Cualquier lugar' : 
                 profileB.flexibilidadDestino === 'regiones' ? (profileB.regionDestino_1 || 'Varias Regiones') :
                 (profileB.comunaDestino_1 || 'Varias Comunas'),
        image: profileB.profileImage || `https://ui-avatars.com/api/?name=${targetData.firstName}+${targetData.lastName}&background=random`,
        bio: profileB.bio || ''
      });
    }
  }

  res.json(candidates);
}));

// @desc    Get saved matches for a user
// @route   GET /api/auth/matches/:id
router.get('/matches/:id', protect, asyncHandler(async (req: any, res: any) => {
  const userId = req.params.id;
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado' });
    return;
  }
  
  const userDocRef = usersRef.doc(userId);
  const userDoc = await userDocRef.get();
  
  if (!userDoc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  
  const userData = userDoc.data() as any;
  const savedMatchesIds = userData.savedMatches || [];
  
  if (savedMatchesIds.length === 0) {
    res.json([]);
    return;
  }

  const matches = [];
  for (const matchId of savedMatchesIds) {
    const matchDoc = await usersRef.doc(matchId).get();
    if (!matchDoc.exists) continue;
    
    const targetData = matchDoc.data() as any;
    const profileB = targetData.profileData || {};
    
    matches.push({
      id: matchDoc.id,
      name: `${targetData.firstName} ${targetData.lastName}`,
      email: targetData.email,
      phone: targetData.phone || profileB.phone || 'No especificado',
      role: profileB.categoriaProfesional || targetData.profession,
      specialty: profileB.profesion || targetData.profession,
      actual: profileB.comunaActual || 'No especificado',
      centroActual: profileB.centroSaludActual || 'Centro de Salud no especificado',
      desired: profileB.flexibilidadDestino === 'cualquiera' ? 'Cualquier lugar' : 
               profileB.flexibilidadDestino === 'regiones' ? (profileB.regionDestino_1 || 'Varias Regiones') :
               (profileB.comunaDestino_1 || 'Varias Comunas'),
      image: profileB.profileImage || `https://ui-avatars.com/api/?name=${targetData.firstName}+${targetData.lastName}&background=random`,
      bio: profileB.bio || ''
    });
  }

  res.json(matches);
}));

// @desc    Handle Swipe Action
// @route   POST /api/auth/swipe
router.post('/swipe', protect, asyncHandler(async (req: any, res: any) => {
  const { userId, targetId, action } = req.body;
  
  if (!userId || !targetId || !action) {
    res.status(400).json({ message: 'Missing parameters' });
    return;
  }
  
  if (req.user.id !== userId && !req.user.isAdmin) {
    res.status(403).json({ message: 'No autorizado' });
    return;
  }
  
  const userDocRef = usersRef.doc(userId);
  const userDoc = await userDocRef.get();
  if (!userDoc.exists) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  
  const userData = userDoc.data() as any;
  let savedMatches = userData.savedMatches || [];
  let passedMatches = userData.passedMatches || [];
  
  if (action === 'like' && !savedMatches.includes(targetId)) {
    savedMatches.push(targetId);
  } else if (action === 'pass' && !passedMatches.includes(targetId)) {
    passedMatches.push(targetId);
  }
  
  await userDocRef.update({ savedMatches, passedMatches });
  
  res.json({ message: 'Swipe recorded' });
}));

// @desc    Get all users for admin
// @route   GET /api/auth/users
router.get('/users', protect, adminOnly, asyncHandler(async (req: any, res: any) => {
  const snapshot = await usersRef.get();
  const users = snapshot.docs.map(doc => {
    const data = doc.data();
    delete data.password;
    return {
      id: doc.id,
      isAdmin: data.email === 'dabrito.dw24@gmail.com' || data.isAdmin === true,
      ...data
    };
  });
  res.json(users);
}));

// @desc    Toggle admin status for a user
// @route   PUT /api/auth/toggle-admin
router.put('/toggle-admin', protect, adminOnly, asyncHandler(async (req: any, res: any) => {
  const { targetUserId, isAdmin } = req.body;
  
  const userDocRef = usersRef.doc(targetUserId);
  const doc = await userDocRef.get();
  if (!doc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  await userDocRef.update({ isAdmin });
  res.json({ message: 'Permisos actualizados' });
}));

// @desc    Toggle verified status for a user
// @route   PUT /api/auth/toggle-verify
router.put('/toggle-verify', protect, adminOnly, asyncHandler(async (req: any, res: any) => {
  const { targetUserId, isVerified } = req.body;
  
  const userDocRef = usersRef.doc(targetUserId);
  const doc = await userDocRef.get();
  if (!doc.exists) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  await userDocRef.update({ isVerified });
  res.json({ message: 'Estado de verificación actualizado' });
}));

// @desc    Forgot Password - Send Reset Email
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'El correo electrónico es requerido' });
    return;
  }

  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    // Return success anyway to prevent email enumeration
    res.json({ message: 'Si el correo existe, se enviarán las instrucciones para restablecer la contraseña.' });
    return;
  }

  const userDoc = snapshot.docs[0];
  const userId = userDoc.id;
  const userData = userDoc.data();

  if (userData.provider && userData.provider !== 'local' && userData.provider !== 'social') {
      // It's a social login user
      res.status(400).json({ message: 'Esta cuenta utiliza inicio de sesión social. Por favor, inicia sesión con tu proveedor (Google/Microsoft).' });
      return;
  }

  // Generate Reset Token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await usersRef.doc(userId).update({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: resetTokenExpire
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;

  const message = `
    <h2>Restablecer Contraseña</h2>
    <p>Has solicitado restablecer tu contraseña en PermutaSalud.</p>
    <p>Por favor haz clic en el siguiente enlace para cambiar tu contraseña. Este enlace expirará en 15 minutos.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Cambiar Contraseña</a>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
  `;

  try {
    await getTransporter().sendMail({
      from: `"PermutaSalud" <contacto.permutasalud@gmail.com>`,
      to: email,
      subject: "Restablecer tu contraseña - PermutaSalud",
      html: message,
    });
    res.json({ message: 'Si el correo existe, se enviarán las instrucciones para restablecer la contraseña.' });
  } catch (error) {
    console.error('Error sending email:', error);
    await usersRef.doc(userId).update({
      resetPasswordToken: null,
      resetPasswordExpire: null
    });
    res.status(500).json({ message: 'Hubo un error enviando el correo. Intenta de nuevo más tarde.' });
  }
}));

// @desc    Reset Password
// @route   POST /api/auth/reset-password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ message: 'Faltan parámetros requeridos' });
    return;
  }

  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const snapshot = await usersRef
    .where('resetPasswordToken', '==', resetTokenHash)
    .where('resetPasswordExpire', '>', new Date())
    .limit(1)
    .get();

  if (snapshot.empty) {
    res.status(400).json({ message: 'El token de restablecimiento es inválido o ha expirado.' });
    return;
  }

  const userDoc = snapshot.docs[0];
  const userId = userDoc.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await usersRef.doc(userId).update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpire: null
  });

  res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.' });
}));

export default router;
