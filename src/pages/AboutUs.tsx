import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24 relative">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-bold uppercase tracking-wider mb-6">
              <HeartPulse size={18} />
              Nuestra Historia
            </div>
            <h1 className="font-headline font-black text-5xl md:text-6xl text-slate-900 mb-6 tracking-tight leading-tight">
              Cuidando a quienes <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">nos cuidan a todos.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Conoce el propósito detrás de PermutaSalud y cómo estamos transformando la vida de los profesionales en el sistema de salud público.
            </p>
          </motion.div>
          <motion.div
            className="flex-1 relative w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Abstract Visual Concept */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-8 border border-slate-100 shadow-2xl shadow-blue-900/10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMwLjUgMjEuNWw3IDcgNy03LTctNy03IDdtLTUgMGwtNyA3LTcgNyA3LTcgNy03IDcgN201IDBsNy03IDctNy03LTctNyA3LTcgN20tNSAwaC0ybC03LTctNS01aC0ybC03LTdtNSAwaDJsNy03IDUtNWgybDctN20tNSAwbC03LTcgNy03IDcgNy03IDdtNSAwbDcgNy03LTctNy03IDcgN20tNSAwSDMyLjVsNy03IDUtNWgxLjVsNy03IiBmaWxsPSIjRTBFN0ZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtb3BhY2l0eT0iLjQiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative z-10 w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-200/50">
                <HeartPulse size={80} className="text-indigo-600" strokeWidth={1.5} />
              </div>
              <div className="absolute top-[10%] right-[10%] w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12">
                <Users size={40} className="text-blue-600" />
              </div>
              <div className="absolute bottom-[10%] left-[10%] w-28 h-28 bg-teal-100 rounded-[2rem] flex items-center justify-center shadow-lg transform -rotate-12">
                <Globe size={48} className="text-teal-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="bg-slate-50 py-24 relative border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-headline mb-4 tracking-tight">
              ¿Cómo nació <span className="text-blue-600">PermutaSalud</span>?
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Año 2026, ¿ y todavía no existe una plataforma para permutar cargos en el sistema de salud público municipal?
            </p>
          </div>

          <div className="space-y-12">
            {/* Chapter 1 */}
            <motion.div
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 font-headline text-2xl transform group-hover:-translate-y-2 transition-transform duration-300">1</div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 font-headline">Misión (casi) Imposible</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Durante años, el metodo para permutar cargos en el sistema de salud público municipal ha sido un proceso engorroso y poco transparente. TU debes buscar a esa persona que quiere permutar contigo. Pero si eres de región? como verificas que la persona realmente existe y que tiene la intención de permutar?
              </p>
            </motion.div>

            {/* Chapter 2 */}
            <motion.div
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-6 -left-6 w-14 h-14 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 font-headline text-2xl transform group-hover:-translate-y-2 transition-transform duration-300">2</div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 font-headline">El Azar como Método</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                El mecanismo existente dependía de la suerte: el boca a boca o grupos no especializados en redes sociales donde lograr coincidir en vacantes equivalentes era casi milagroso. Frustrados por esta ineficiencia, decidimos que la tecnología debía cambiar las reglas.
              </p>
            </motion.div>

            {/* Chapter 3 */}
            <motion.div
              className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-blue-900/20 relative text-white group hover:-translate-y-2 transition-transform duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                <Shield size={160} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 font-headline text-white relative z-10">Un Puente Tecnológico</h3>
              <p className="text-blue-100 leading-relaxed relative z-10 text-lg">
                Así fundamos <strong>PermutaSalud</strong>, garantizando un flujo estructurado y transparente exclusivo para el personal de salud. Nuestro sueño es conectar estas oportunidades a nivel nacional para que cada funcionario trabaje junto a los suyos, convencidos de que cuidar de ellos es cuidar del país.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / Values */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-headline mb-4">Nuestros Pilares</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white border border-slate-100 p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -8 }}
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
              <Users size={32} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-3 font-headline">Comunidad Única</h4>
            <p className="text-slate-600 leading-relaxed">Verificamos la afiliación de los usuarios para crear una red de seguridad infalible y pertinente a tu cargo.</p>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-100 p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -8 }}
          >
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 border border-teal-100">
              <Globe size={32} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-3 font-headline">Red Nacional</h4>
            <p className="text-slate-600 leading-relaxed">Integramos y centralizamos ofertas de norte a sur, eliminando por completo las murallas geográficas.</p>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-100 p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -8 }}
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
              <HeartPulse size={32} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-3 font-headline">Tú al Centro</h4>
            <p className="text-slate-600 leading-relaxed">Fomentamos el bienestar mutuo; una mejor calidad de vida genera un mejor servicio para todos los pacientes.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-6 tracking-tight">Sé parte del Cambio</h2>
          <p className="text-blue-100 text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light">
            Encuentra de forma rápida y segura el entorno ideal para tu desarrollo profesional y personal.
          </p>
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 font-bold rounded-2xl text-xl hover:shadow-2xl hover:shadow-blue-900/50 hover:scale-105 transition-all duration-300">
            Únete a la Red Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
