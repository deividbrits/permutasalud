import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, EyeOff, Key, Trash2 } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-800 text-sm font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={18} />
            Privacidad Simple y Clara
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 tracking-tight">
            Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Privacidad</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sin palabras enredadas ni jerga legal compleja. Te explicamos exactamente qué hacemos con tu información, cómo la cuidamos y cuáles son tus derechos.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-slate-500 mb-10 text-sm">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>

          <div className="space-y-12">
            
            {/* Section 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <UserCheck size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-headline">1. ¿Qué datos te pedimos y para qué?</h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Solo te pedimos lo estrictamente necesario para que el sistema de permutas funcione y podamos conectarte con otros colegas:
                </p>
                <ul className="list-disc list-inside text-slate-600 leading-relaxed space-y-2">
                  <li><strong>Tus datos de contacto</strong> (email y teléfono) para avisarte de forma inmediata si hay un "Match".</li>
                  <li><strong>Tus datos laborales</strong> (dónde trabajas actualmente y hacia dónde quieres ir) para que el algoritmo busque tu oportunidad ideal.</li>
                  <li><strong>Un documento oficial</strong> (contrato o certificado) únicamente para verificar que eres un trabajador real del sistema público. <em>Este documento solo se usa para validar tu cuenta y no queda expuesto.</em></li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <EyeOff size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-headline">2. Privacidad garantizada (Nadie te espía)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tu perfil en las listas públicas de PermutaSalud es <strong>completamente anónimo</strong>. Las personas que buscan permutas solo verán tu comuna de origen, comuna de destino y tu profesión (por ejemplo: "Enfermera de Santiago buscando ir a Valparaíso"). 
                  <strong> Tus nombres, apellidos y tu número de teléfono solo se revelan a otra persona si ambos presionan el botón de "Aceptar" mutuamente.</strong>
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Key size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-headline">3. Nunca venderemos tus datos</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tu información te pertenece. Te garantizamos que <strong>no vendemos, no alquilamos y no compartimos</strong> tus datos personales con empresas de publicidad, aseguradoras, bancos ni terceros bajo ningún concepto. Nuestra única misión es ayudarte a encontrar tu permuta, no lucrar con tus datos.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-headline">4. ¿Cómo protegemos la información?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Usamos tecnología de encriptación moderna de bases de datos mundiales (Google Cloud y Firebase). Esto significa que tu información viaja y se guarda bloqueada con candados digitales. Además, la revisión de tu contrato la hace un asistente de Inteligencia Artificial (IA) en entornos aislados, sin que intervengan personas leyendo tu sueldo u otra información salarial.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 font-headline">5. Tu derecho a borrarlo todo</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tienes el control total de tu perfil. En el momento que ya no nos necesites (¡esperamos que sea porque encontraste tu permuta!), puedes entrar a los ajustes de tu cuenta y solicitar su eliminación. Al hacerlo, borraremos <strong>todo rastro</strong> tuyo de nuestros servidores de forma definitiva e irreversible.
                </p>
              </div>
            </div>

          </div>

          <hr className="my-10 border-slate-200" />
          
          <p className="text-center text-slate-600 bg-slate-50 p-6 rounded-2xl">
            Si tienes dudas o crees que algo no está claro en esta política, escríbenos directamente a través de nuestra sección de <strong>Centro de Ayuda</strong>. Estamos para apoyarte con total transparencia.
          </p>

        </motion.div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
