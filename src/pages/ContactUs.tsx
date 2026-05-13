import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular el tiempo de envío al servidor
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setIsSuccess(false), 5000);

      // Limpiar formulario (en un caso real, esto dependería de los refs o state del form)
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Mail size={32} />
            </div>
            <h1 className="font-headline font-black text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Contáctanos</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              ¿Tienes algún problema con tu cuenta o sugerencias para mejorar? Escríbenos y nuestro equipo te responderá a la brevedad.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-8 font-headline">Información de Soporte</h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</p>
                    <a href="mailto:contacto.permutasalud@gmail.com" className="text-slate-800 font-bold hover:text-blue-600 transition-colors break-all">
                      contacto.permutasalud@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono o WhatsApp</p>
                    <p className="text-slate-800 font-bold">+56 9 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ubicación</p>
                    <p className="text-slate-800 font-bold">Chile<br /><span className="text-slate-500 font-normal text-sm">Plataforma 100% remota</span></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">

              {/* Success Overlay */}
              {isSuccess && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 font-headline">¡Mensaje Enviado!</h3>
                  <p className="text-lg text-slate-600 max-w-md">
                    Hemos recibido tu consulta correctamente. Nuestro equipo de soporte la revisará y te contactará a tu correo en las próximas 24 horas.
                  </p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-headline">Envíanos un mensaje directo</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Asunto o Motivo de Ayuda</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-700"
                  >
                    <option value="">Selecciona el motivo de tu consulta...</option>
                    <option value="verificacion">Problemas con la verificación de mi contrato</option>
                    <option value="cuenta">Problemas con mi cuenta o inicio de sesión</option>
                    <option value="match">Dudas sobre el proceso de un "Match"</option>
                    <option value="sugerencia">Tengo una sugerencia o quiero reportar un error</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detalle de tu Mensaje / Pregunta</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe de manera detallada en qué te podemos ayudar para darte una respuesta más rápida..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-70 text-lg"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Enviando mensaje...</span>
                  ) : (
                    <>
                      Enviar Mensaje
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
};

export default ContactUs;
