import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, ChevronDown, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: '¿Cómo funciona el sistema de Match?',
    answer: 'Nuestro algoritmo cruza continuamente las preferencias de todos los usuarios. Cuando encuentras a un colega cuya comuna de origen es la que tú deseas, y tu comuna actual es la que él/ella desea (y sus cargos son compatibles), se genera un "Match" y ambos reciben una notificación para intercambiar contactos.'
  },
  {
    question: '¿Puedo cancelar un Match si me arrepiento?',
    answer: '¡Por supuesto! Hacer un Match en la plataforma no te obliga legalmente a nada. Es solo un puente de comunicación inicial. Si tras conversar con la otra persona decides no continuar, pueden simplemente cancelar el proceso sin penalizaciones de nuestra parte.'
  },
  {
    question: 'Ya subí mi contrato, ¿por qué sigo como "No Verificado"?',
    answer: 'La verificación por Inteligencia Artificial suele tardar unos segundos, pero en ocasiones el documento puede ser ilegible o estar borroso. Si han pasado más de 24 horas y tu perfil sigue sin verificarse, por favor intenta subir una copia en PDF más nítida desde el botón "Volver a Verificar" en Ajustes.'
  },
  {
    question: '¿Es obligatorio ser funcionario Titular (plazo indefinido) para permutar?',
    answer: 'La Ley permite permutas principalmente entre funcionarios titulares. Sin embargo, en algunos municipios existen acuerdos para trabajadores a contrata, dependiendo de las voluntades de los alcaldes y directores de salud. Te recomendamos revisar el Estatuto de Atención Primaria (Ley 19.378) y consultar directamente en tu departamento de RRHH.'
  },
  {
    question: 'Encontré mi permuta por otro medio, ¿puedo pausar o eliminar mi perfil?',
    answer: 'Sí. Puedes ir al menú superior derecho, ingresar a "Ajustes" y seleccionar la opción "Eliminar mi cuenta". Esto borrará todos tus datos y dejarás de aparecer en los resultados de búsqueda de forma inmediata y permanente.'
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
        <span className="font-bold text-slate-800 text-lg pr-8">{question}</span>
        <div className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
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

const HelpCenter: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
              <LifeBuoy size={32} />
            </div>
            <h1 className="font-headline font-black text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Centro de Ayuda</h1>
            <p className="text-lg text-slate-600">Encuentra respuestas rápidas a las dudas más comunes sobre la plataforma y el proceso de permuta.</p>
          </motion.div>
        </div>

        {/* Q&A List */}
        <div className="space-y-2 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>

        {/* CTA Contacto */}
        <motion.div 
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-center text-white shadow-xl shadow-blue-900/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Mail size={40} className="mx-auto mb-4 text-blue-200" />
          <h2 className="text-2xl font-bold mb-3 font-headline">¿No encontraste lo que buscabas?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Nuestro equipo de soporte está listo para ayudarte con cualquier problema técnico o duda que tengas sobre tu cuenta.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
            Ir a Contáctanos
            <ArrowRight size={20} />
          </Link>
        </motion.div>

      </div>
    </main>
  );
};

export default HelpCenter;
