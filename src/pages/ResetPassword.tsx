import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Lado izquierdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90 z-10" />
        <img
          src="https://picsum.photos/seed/hospital-reset/1000/1000"
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
              Seguridad para tu cuenta.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Establece una nueva contraseña segura para recuperar el acceso a tu cuenta de PermutaSalud.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto bg-white relative">
        <Link to="/login" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={16} />
            <span className="font-medium text-sm">Volver al login</span>
        </Link>
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!token ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold">!</span>
                </div>
                <h2 className="font-headline font-extrabold text-2xl text-slate-900 mb-4">Enlace no válido</h2>
                <p className="text-slate-500 mb-8">
                  El enlace para restablecer la contraseña no existe o está incompleto.
                </p>
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-block">
                  Ir a Iniciar Sesión
                </Link>
              </div>
            ) : success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} />
                </div>
                <h2 className="font-headline font-extrabold text-2xl text-slate-900 mb-4">¡Contraseña Actualizada!</h2>
                <p className="text-slate-500 mb-8">
                  {success}
                </p>
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-block w-full">
                  Iniciar Sesión
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="font-headline font-extrabold text-3xl text-slate-900 mb-2">Nueva Contraseña</h2>
                  <p className="text-slate-500">Ingresa tu nueva contraseña para recuperar el acceso</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="font-label text-sm font-medium text-slate-600 ml-1">Nueva Contraseña</label>
                    <input
                      className="w-full px-5 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 placeholder:text-slate-400 font-body"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-label text-sm font-medium text-slate-600 ml-1">Confirmar Contraseña</label>
                    <input
                      className="w-full px-5 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 placeholder:text-slate-400 font-body"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button
                    className="w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
