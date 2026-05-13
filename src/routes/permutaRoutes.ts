import express from 'express';
import asyncHandler from 'express-async-handler';
import { db } from '../config/firebase';
import { IPermuta } from '../models/Permuta';

const router = express.Router();
const permutasRef = db.collection('permutas');

// @desc    Get all active permutas
// @route   GET /api/permutas
router.get('/', asyncHandler(async (req, res) => {
  const snapshot = await permutasRef.where('status', '==', 'active').get();
  const permutas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  
  // Sort in memory to avoid requiring a composite index in Firestore for status and createdAt
  permutas.sort((a, b) => {
    const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt || 0).getTime());
    const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt || 0).getTime());
    return timeB - timeA;
  });

  res.json(permutas);
}));

// @desc    Get permuta by user ID
// @route   GET /api/permutas/user/:userId
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const snapshot = await permutasRef.where('userId', '==', req.params.userId).limit(1).get();
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } else {
    res.status(404);
    throw new Error('Permuta not found for this user');
  }
}));

// @desc    Create or update permuta
// @route   POST /api/permutas
router.post('/', asyncHandler(async (req, res) => {
  const { userId, userName, userRole, userCategory, userLevel, actualCommune, desiredCommunes, description } = req.body;
  
  const snapshot = await permutasRef.where('userId', '==', userId).limit(1).get();
  
  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data() as IPermuta;
    
    const updateData: Partial<IPermuta> = {
      userName: userName || data.userName,
      userRole: userRole || data.userRole,
      userCategory: userCategory || data.userCategory,
      userLevel: userLevel || data.userLevel,
      actualCommune: actualCommune || data.actualCommune,
      desiredCommunes: desiredCommunes || data.desiredCommunes,
      description: description !== undefined ? description : data.description,
      updatedAt: new Date()
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

    await docRef.update(updateData as any);
    res.json({ id: docRef.id, ...data, ...updateData });
  } else {
    const newPermuta = {
      userId,
      userName,
      userRole,
      userCategory,
      userLevel,
      actualCommune,
      desiredCommunes,
      description: description || null,
      status: 'active',
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remove undefined fields
    Object.keys(newPermuta).forEach(key => (newPermuta as any)[key] === undefined && delete (newPermuta as any)[key]);

    const docRef = await permutasRef.add(newPermuta);
    res.status(201).json({ id: docRef.id, ...newPermuta });
  }
}));

// @desc    Delete permuta
// @route   DELETE /api/permutas/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const docRef = permutasRef.doc(req.params.id);
  const doc = await docRef.get();
  
  if (doc.exists) {
    await docRef.delete();
    res.json({ message: 'Permuta removed' });
  } else {
    res.status(404);
    throw new Error('Permuta not found');
  }
}));

export default router;
