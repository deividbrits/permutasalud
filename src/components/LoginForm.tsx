import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseClient';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        
        if (data.needsProfileCompletion) {
          navigate('/completar-perfil');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setResetEmail('');
      } else {
        setError(data.message || 'Error al solicitar el cambio de contraseña');
      }
    } catch (err) {
      setError('Error conectando al servidor');
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
        
        if (data.needsProfileCompletion) {
          navigate('/completar-perfil');
        } else {
          navigate('/dashboard');
        }
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

  const renderLoginForm = (
    <>
      <div className="mb-10">
        <h2 className="font-headline font-extrabold text-3xl text-slate-900 mb-2">Bienvenido</h2>
        <p className="text-slate-500">Inicia sesión para gestionar tus intercambios profesionales</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-slate-600 ml-1">Email</label>
          <input
            className="w-full px-5 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 placeholder:text-slate-400 font-body"
            placeholder="dr.name@institution.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-slate-600 ml-1">Password</label>
          <input
            className="w-full px-5 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 placeholder:text-slate-400 font-body"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/40" type="checkbox" />
            <span className="text-slate-500">Recuerdame</span>
          </label>
          <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); }} className="text-blue-600 font-semibold hover:underline">Olvidaste tu Contraseña?</button>
        </div>
        <button
          className="w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          type="submit"
          disabled={loading || socialLoading}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-400 font-label uppercase text-xs tracking-wider">O CONTINUA CON</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={socialLoading || loading}
          className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all font-medium text-slate-900 disabled:opacity-50"
        >
          <img alt="Google" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
          Google
        </button>
        <button 
          type="button"
          onClick={() => handleSocialLogin('microsoft')}
          disabled={socialLoading || loading}
          className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all font-medium text-slate-900 disabled:opacity-50"
        >
          <img alt="Microsoft" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg" />
          Microsoft
        </button>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        Nuevo en la Plataforma? <Link className="text-blue-600 font-semibold hover:underline" to="/register">Registrate</Link>
      </p>
    </>
  );

  if (isForgotPassword) {
    return (
      <>
        <div className="mb-10">
          <h2 className="font-headline font-extrabold text-3xl text-slate-900 mb-2">Restablecer Contraseña</h2>
          <p className="text-slate-500">Ingresa tu correo para recibir un enlace seguro</p>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              {message}
            </div>
          )}
          <div className="space-y-2">
            <label className="font-label text-sm font-medium text-slate-600 ml-1">Email</label>
            <input
              className="w-full px-5 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 placeholder:text-slate-400 font-body"
              placeholder="dr.name@institution.com"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
          <div className="text-center mt-6">
            <button type="button" onClick={() => { setIsForgotPassword(false); setError(''); setMessage(''); }} className="text-blue-600 font-semibold hover:underline text-sm">
              Volver al Inicio de Sesión
            </button>
          </div>
        </form>
      </>
    );
  }

  return renderLoginForm;
};

export default LoginForm;
