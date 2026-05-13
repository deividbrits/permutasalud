import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { validateRut, formatRut } from '../utils/rutValidator';
import { auth } from '../config/firebaseClient';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rut: '',
    phone: '',
    email: '',
    profession: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === 'rut') {
      value = formatRut(value);
    }
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateRut(formData.rut)) {
      setError('Por favor, ingresa un RUT válido');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        navigate('/completar-perfil');
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'microsoft') => {
    setError('');
    setSocialLoading(true);
    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        provider = new OAuthProvider('microsoft.com');
      }
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const idToken = await user.getIdToken();

      const response = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          provider: providerName
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        navigate('/completar-perfil');
      } else {
        setError(data.message || 'Error en la autenticación social');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al conectar con el proveedor');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Lado izquierdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90 z-10" />
        <img
          src="https://picsum.photos/seed/hospital-register/1000/1000"
          alt="Medical Background"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%]"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 max-w-lg px-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 hover:text-blue-200 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Volver a Inicio</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
               <span className="font-extrabold text-2xl">P</span>
            </div>
            <h1 className="font-headline font-extrabold text-5xl leading-tight mb-6 tracking-tight">
              Únete a la red de PermutaSalud.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Crea tu cuenta ahora para encontrar el traslado ideal y conectar con cientos de profesionales de la salud en todo el país.
            </p>
            
            <div className="space-y-4">
              {[
                'Búsqueda rápida de vacantes',
                'Conexión segura y directa',
                'Perfil profesional destacado'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span className="font-medium text-blue-50">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={16} />
            <span className="font-medium text-sm">Volver</span>
        </Link>
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-slate-900 mb-3 tracking-tight">
                Crear Cuenta
              </h2>
              <p className="text-slate-500">
                Ingresa tus datos a continuación para registrarte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-slate-600 ml-1">Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                    placeholder="Ej. Juan"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-slate-600 ml-1">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                    placeholder="Ej. Pérez"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-slate-600 ml-1">RUT</label>
                  <input
                    type="text"
                    name="rut"
                    required
                    value={formData.rut}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                    placeholder="12345678-9"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-slate-600 ml-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-slate-600 ml-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                  placeholder="dr.name@institution.com"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-slate-600 ml-1">Profesión</label>
                <select
                  name="profession"
                  required
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-body transition-all outline-none appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>Selecciona tu profesión</option>
                  <option value="medico">Médico General</option>
                  <option value="enfermeria">Enfermera(o)</option>
                  <option value="kinesiologo">Kinesiólogo(a)</option>
                  <option value="dentista">Odontólogo(a)</option>
                  <option value="otro">Otro Profesional de Salud</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-slate-600 ml-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-body transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading || socialLoading}
                className="w-full py-4 mt-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus size={20} />
                {loading ? 'Cargando...' : 'Registrarse'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-label uppercase text-xs tracking-wider">O regístrate con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-50"
              >
                <img alt="Google" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('microsoft')}
                disabled={socialLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-50"
              >
                <img alt="Microsoft" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg" />
                Microsoft
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              ¿Ya tienes una cuenta? <Link className="text-blue-600 font-semibold hover:underline" to="/">Inicia sesión</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
