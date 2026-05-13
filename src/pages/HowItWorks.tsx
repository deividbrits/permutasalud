import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase, RefreshCw, Scale, ArrowRight, ShieldCheck, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Registro y Verificación Institucional',
    description: 'Crea tu cuenta con tus datos profesionales. Nuestro equipo verifica que actualmente te desempeñes en el sistema de salud para garantizar un entorno seguro y exclusivo para los funcionarios de la red médica.',
    icon: UserPlus,
    gradient: 'from-blue-600 to-cyan-500',
    shadow: 'shadow-blue-500/30'
  },
  {
    id: 2,
    title: 'Publica tu Cargo y Preferencias',
    description: 'Especifica tu rol actual, establecimiento y condiciones del contrato. Luego, indícanos hacia qué región o recinto te gustaría trasladarte para que el sistema comience a buscar oportunidades que calcen con tu perfil.',
    icon: Briefcase,
    gradient: 'from-indigo-600 to-violet-500',
    shadow: 'shadow-indigo-500/30'
  },
  {
    id: 3,
    title: 'Búsqueda y Match Directo',
    description: 'Nuestro algoritmo inteligente conecta automáticamente tu perfil con el de otros profesionales que tengan intereses cruzados. Recibirás alertas inmediatas cuando exista un "match" compatible con tus condiciones.',
    icon: RefreshCw,
    gradient: 'from-fuchsia-600 to-pink-500',
    shadow: 'shadow-pink-500/30'
  },
  {
    id: 4,
    title: 'Proceso de Permuta Legal',
    description: 'Una vez que ambos profesionales confirman el interés, los guiamos paso a paso en el proceso legal y administrativo de permuta de cargos, respaldado por las respectivas entidades u hospitales.',
    icon: Scale,
    gradient: 'from-orange-500 to-amber-400',
    shadow: 'shadow-orange-500/30'
  }
];

const faqs = [
  {
    question: '¿Tiene algún costo utilizar PermutaSalud?',
    answer: 'El registro y la búsqueda de coincidencias son totalmente gratuitos para los profesionales de la salud. Nuestro objetivo es facilitar la movilidad laboral en el sector público.'
  },
  {
    question: '¿Qué pasa si encuentro un match pero me arrepiento?',
    answer: 'El "match" es solo el primer paso para poner en contacto a ambos profesionales. No hay ninguna obligación legal hasta que ambas partes inician y firman el proceso formal de permuta con sus respectivos establecimientos.'
  },
  {
    question: '¿Cómo validan que los usuarios son realmente profesionales de la salud?',
    answer: 'Implementamos un sistema de verificación estricto. Solicitamos la subida de un documento que acredite tu situación contractual actual, el cual es validado por nuestro sistema de IA antes de activar tu perfil para búsquedas.'
  },
  {
    question: '¿Cuánto tiempo tarda el proceso legal de permuta?',
    answer: 'El tiempo varía dependiendo de los Servicios de Salud involucrados y la agilidad administrativa de cada municipalidad o servicio. Puede tomar desde un par de semanas hasta algunos meses una vez iniciado formalmente.'
  }
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-2xl mb-4 bg-white overflow-hidden transition-all duration-300 hover:border-blue-300 hover:shadow-md">
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-slate-800 text-lg">{question}</span>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
          <ChevronDown size={24} />
        </div>
      </button>
      <div 
        className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <p className="text-slate-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 overflow-hidden">
      {/* Encabezado */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={18} />
            Metodología Segura
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-6 tracking-tight">
            Cómo Funciona <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">PermutaSalud</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Descubre lo fácil y seguro que es encontrar la permuta de cargo ideal mediante nuestra red inteligente conectada a nivel nacional.
          </p>
        </motion.div>
      </section>

      {/* Flujo de Pasos */}
      <section className="max-w-5xl mx-auto px-6 relative">
        {/* Línea Central (Background) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-indigo-100 to-amber-50 rounded-full transform -translate-x-1/2 hidden md:block"></div>

        <div className="space-y-24 md:space-y-36">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={step.id} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Contenido (Texto) */}
                <motion.div 
                  className={`flex-1 w-full text-center ${isEven ? 'md:text-right' : 'md:text-left'}`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
                >
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-2 font-headline">
                    Paso 0{step.id}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 font-headline leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0">
                    {step.description}
                  </p>
                </motion.div>

                {/* Ícono central */}
                <motion.div 
                  className="relative z-10 hidden md:flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-xl ${step.shadow} rotate-45 transform hover:rotate-0 transition-all duration-500`}>
                    <div className="transform -rotate-45 hover:rotate-0 transition-all duration-500">
                      <step.icon size={32} strokeWidth={2.5} />
                    </div>
                  </div>
                </motion.div>

                {/* Placeholder para balancear Flexbox */}
                <div className="flex-1 hidden md:block"></div>
                
                {/* Ícono móvil (Visible solo en pantallas pequeñas) */}
                <div className="md:hidden flex items-center justify-center mt-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg ${step.shadow}`}>
                    <step.icon size={28} strokeWidth={2.5} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="max-w-3xl mx-auto px-6 mt-32 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 font-headline tracking-tight">Preguntas Frecuentes</h2>
          <p className="text-lg text-slate-500">Todo lo que necesitas saber sobre el proceso de permuta y nuestra plataforma.</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <motion.div 
          className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-blue-900/5 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-headline tracking-tight">
              ¿Listo para encontrar <br className="hidden md:block" /> tu lugar ideal?
            </h2>
            <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto">
              Únete a la red más grande de profesionales de salud buscando intercambios en todo el país.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-2xl text-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3">
                Crear una Cuenta Ahora
                <UserPlus size={20} />
              </Link>
              <Link to="/" className="w-full sm:w-auto px-8 py-5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                Volver al Inicio
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default HowItWorks;
