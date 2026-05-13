import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-7 space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <CheckCircle size={14} />
          Red Profesional
        </div>
        <h1 className="font-headline font-extrabold text-5xl lg:text-7xl text-slate-900 leading-[1.1] tracking-tight">
          Mobilidad Profesional en un "Click".
        </h1>
        <p className="text-slate-600 text-lg lg:text-xl max-w-xl leading-relaxed">
          Red designada exclusivamente para profesionales de salud municipal con el fin de facilitar la búsqueda de una permuta de cargo a nivel regional o nacional.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link to="/register" className="px-8 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-lg hover:brightness-110 transition-all shadow-lg flex items-center gap-2">
            Regístrate
            <ArrowRight size={20} />
          </Link>
          <Link to="/help" className="px-8 py-4 bg-slate-100 text-blue-700 font-bold rounded-xl text-lg hover:bg-slate-200 transition-all">
            Más Información
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:col-span-5 relative"
      >
        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-slate-200">
          <img
            src="https://picsum.photos/seed/hospital/800/800"
            alt="Medical Workspace"
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-[240px] border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <CheckCircle size={20} />
            </div>
            <span className="text-sm font-bold font-headline">Permuta Reciente</span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            Dra. Elena M. permutó su cargo desde Santiago a Valparaíso.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
