import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Scale } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
            <Scale size={18} />
            Documento Legal
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 tracking-tight">
            Términos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Servicio</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Por favor lee detenidamente nuestras condiciones de uso antes de registrarte en PermutaSalud.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6">
        <motion.div 
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 prose prose-slate max-w-none prose-headings:font-headline prose-headings:font-bold prose-h2:text-2xl prose-h2:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>
          <p>
            Al acceder y utilizar <strong>PermutaSalud</strong>, aceptas cumplir y estar sujeto a los siguientes Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra plataforma.
          </p>

          <h2>1. Naturaleza del Servicio</h2>
          <p>
            PermutaSalud es una plataforma digital diseñada exclusivamente para facilitar la conexión entre profesionales del sector salud municipal en Chile que buscan realizar una permuta de sus cargos. Nosotros proveemos la tecnología de contacto (el "Match"), pero <strong>no somos responsables del proceso legal, administrativo ni de las decisiones que tomen los Servicios de Salud o las Municipalidades</strong> involucradas.
          </p>

          <h2>2. Elegibilidad y Registro</h2>
          <p>
            Para utilizar esta plataforma, debes ser un profesional de la salud con contrato vigente en el sistema público o municipal. Todo usuario debe pasar por un proceso de verificación de identidad e historial laboral, para el cual se solicitará subir un documento probatorio (contrato de trabajo, certificado de antigüedad, etc.).
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl my-8 not-prose">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="text-red-800 font-bold text-xl m-0 font-headline">3. Tolerancia Cero a la Falsificación de Datos</h3>
            </div>
            <p className="text-red-900 mb-4 leading-relaxed">
              La confianza es el pilar fundamental de nuestra red. <strong>Cualquier intento de subir documentos falsificados, adulterados, el uso de identidades de terceros o proporcionar información maliciosa resultará en la suspensión INMEDIATA y PERMANENTE de tu cuenta.</strong>
            </p>
            <p className="text-red-900 mb-0 leading-relaxed">
              PermutaSalud se reserva el estricto derecho de reportar estas irregularidades a las autoridades competentes y a los respectivos Servicios de Salud si se detecta un intento claro de fraude o suplantación de identidad. Protegemos activamente a nuestra comunidad de estas prácticas.
            </p>
          </div>

          <h2>4. Uso Aceptable y Conducta</h2>
          <p>
            Al usar la plataforma te comprometes a:
          </p>
          <ul>
            <li>Interactuar con otros profesionales de manera respetuosa y ética en todo momento.</li>
            <li>No utilizar la plataforma para propósitos comerciales, publicitarios u otros ajenos a las permutas de salud.</li>
            <li>No intentar vulnerar la seguridad del sitio web, introducir código malicioso ni acceder a bases de datos no autorizadas.</li>
            <li>Mantener la absoluta confidencialidad de la información y datos de contacto recibidos de otros usuarios durante un "Match".</li>
          </ul>

          <h2>5. Proceso de Match y Responsabilidad de las Partes</h2>
          <p>
            Cuando dos profesionales logran una coincidencia de intereses ("Match"), la plataforma liberará los datos de contacto mutuos de forma segura. Desde ese momento, la negociación, comunicación y eventual tramitación legal recae estrictamente en los usuarios. PermutaSalud no interviene en el papeleo burocrático oficial requerido por las entidades gubernamentales.
          </p>

          <h2>6. Limitación de Responsabilidad</h2>
          <p>
            PermutaSalud proporciona el servicio tecnológico "tal cual". No garantizamos de ninguna manera que encontrarás una permuta exitosa o que tu solicitud final será aprobada por tu jefatura correspondiente. No seremos responsables por daños indirectos, expectativas no cumplidas, pérdida de oportunidades laborales o problemas derivados de un intercambio que finalmente no se concrete por razones administrativas.
          </p>

          <h2>7. Modificaciones a los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento para reflejar cambios en nuestras prácticas o por razones operativas, legales o reglamentarias. Te notificaremos sobre cambios significativos a través de un aviso destacado en la plataforma.
          </p>

          <hr className="my-8 border-slate-200" />
          
          <p className="text-sm text-slate-500">
            Si tienes dudas o consultas sobre estos términos y condiciones de servicio, por favor contáctanos a través de nuestros canales oficiales de soporte antes de completar o continuar con tu registro en la plataforma.
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default TermsOfService;
