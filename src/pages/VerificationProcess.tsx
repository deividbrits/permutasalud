import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, BrainCircuit, CheckCircle, ShieldCheck, FileCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Sube tu Contrato',
    description: 'Adjunta tu contrato de trabajo o certificado de antigüedad en formato PDF o Word. Este documento debe mostrar claramente tu relación laboral actual.',
    icon: FileUp,
    color: 'bg-blue-100 text-blue-600',
    border: 'border-blue-100'
  },
  {
    id: 2,
    title: 'Análisis Inteligente',
    description: 'Nuestra Inteligencia Artificial lee de forma segura el documento para extraer y validar automáticamente la información relevante, sin intervención humana.',
    icon: BrainCircuit,
    color: 'bg-purple-100 text-purple-600',
    border: 'border-purple-100'
  },
  {
    id: 3,
    title: 'Validación de Criterios',
    description: 'La IA verifica: que el documento esté vigente, que trabajes en la red de atención primaria (APS) y el tipo de calidad jurídica de tu contrato.',
    icon: FileCheck,
    color: 'bg-amber-100 text-amber-600',
    border: 'border-amber-100'
  },
  {
    id: 4,
    title: 'Perfil Verificado',
    description: 'Al superar el análisis, tu cuenta obtiene la insignia oficial de "Profesional Verificado", dándote acceso inmediato a la red de permutas.',
    icon: ShieldCheck,
    color: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-100'
  }
];

const VerificationProcess: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6">
            <CheckCircle size={18} />
            Transparencia y Seguridad
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 tracking-tight">
            ¿Cómo funciona nuestro <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Proceso de Verificación?</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Para mantener una red exclusiva y segura de funcionarios de la salud pública, hemos implementado una verificación de contratos rápida y automatizada impulsada por Inteligencia Artificial.
          </p>
        </motion.div>
      </section>

      {/* Didactic Process Section */}
      <section className="max-w-5xl mx-auto px-6 mb-32 relative">
        {/* Background connector line */}
        <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border-2 ${step.border} transition-transform duration-300 hover:-translate-y-2 flex flex-col items-center text-center group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <step.icon size={36} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-headline">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust and Speed Banner */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] p-10 md:p-16 border border-blue-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 font-headline tracking-tight">
              Aprobación en Tiempo Récord
            </h2>
            <p className="text-lg text-slate-600 mb-0 leading-relaxed">
              Gracias a la implementación de modelos de lenguaje avanzados, el proceso de lectura y análisis que normalmente tomaría días de trabajo administrativo, se completa en <strong>menos de 30 segundos</strong>. Garantizando precisión algorítmica, privacidad absoluta y acceso inmediato a tu búsqueda de permuta.
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <Link to="/register" className="px-8 py-5 w-full text-center bg-blue-600 text-white font-bold rounded-2xl text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
              Verificarse Ahora
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default VerificationProcess;
