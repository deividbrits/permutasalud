import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileKey, UserCheck, EyeOff, Server, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const protocols = [
  {
    id: 1,
    title: 'Verificación Estricta con Inteligencia Artificial',
    description: 'Utilizamos tecnología de IA avanzada (Google Gemini) para validar cada contrato subido. Esto asegura que todos los perfiles pertenezcan a funcionarios reales y activos en el sistema de salud.',
    icon: UserCheck,
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    id: 2,
    title: 'Encriptación de Extremo a Extremo',
    description: 'Tus datos personales, preferencias de traslado y documentos de contrato están protegidos mediante cifrado de alto nivel tanto en tránsito (SSL/TLS) como en reposo en nuestras bases de datos seguras.',
    icon: Lock,
    gradient: 'from-indigo-500 to-violet-500'
  },
  {
    id: 3,
    title: 'Privacidad por Diseño',
    description: 'Tu perfil detallado es anónimo en la búsqueda general. Tu identidad completa y datos de contacto solo se comparten de manera segura cuando ambos profesionales aceptan mutuamente un "Match".',
    icon: EyeOff,
    gradient: 'from-fuchsia-500 to-pink-500'
  },
  {
    id: 4,
    title: 'Protección de Documentos Sensibles',
    description: 'Los contratos y documentos oficiales subidos para verificación son procesados en entornos aislados y se almacenan bajo los más estrictos controles de acceso y autenticación.',
    icon: FileKey,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 5,
    title: 'Infraestructura Resiliente',
    description: 'Operamos sobre servidores escalables de alta disponibilidad que monitorean constantemente comportamientos inusuales o intentos de acceso no autorizados las 24 horas del día.',
    icon: Server,
    gradient: 'from-emerald-500 to-teal-500'
  }
];

const SecurityProtocols: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 overflow-hidden">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={18} />
            Tu Seguridad es Primero
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-6 tracking-tight">
            Protocolos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Seguridad</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            En PermutaSalud entendemos que tu información profesional y personal es sumamente delicada. Conoce las medidas tecnológicas que hemos implementado para garantizar un entorno 100% seguro y de confianza.
          </p>
        </motion.div>
      </section>

      {/* Protocols Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-32 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.id}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${protocol.gradient} flex items-center justify-center text-white shadow-md mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <protocol.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-headline">{protocol.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {protocol.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <ShieldCheck size={40} className="text-emerald-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-headline tracking-tight">
              ¿Tienes dudas sobre la seguridad?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Nuestro equipo técnico monitorea constantemente la plataforma para asegurar que tus datos estén protegidos las 24 horas del día. Si detectas alguna anomalía, contáctanos de inmediato.
            </p>
            <Link to="/" className="inline-flex px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl text-lg hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all items-center justify-center gap-3">
              Volver al Inicio Seguro
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default SecurityProtocols;
