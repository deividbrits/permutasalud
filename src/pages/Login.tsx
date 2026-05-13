import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Lado izquierdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90 z-10" />
        <img
          src="https://picsum.photos/seed/hospital-login/1000/1000"
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
              Bienvenido de nuevo a PermutaSalud.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Inicia sesión para continuar tu búsqueda de la vacante ideal y gestionar tus intercambios de manera rápida y segura.
            </p>
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
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
