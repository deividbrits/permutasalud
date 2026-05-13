import React from 'react';
import { ShieldCheck, FileText, UserCheck, AlertTriangle } from 'lucide-react';

export default function Requirements() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Requisitos para una <span className="text-blue-600">Permuta Exitosa</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Para garantizar un proceso transparente y seguro, todos los profesionales deben cumplir con los siguientes requisitos fundamentales antes de realizar una permuta.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-xl mr-6 mt-1 flex-shrink-0">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Titularidad del Cargo</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Ambos profesionales deben ser titulares de sus respectivos cargos en la administración pública. Las permutas no aplican para personal a contrata, honorarios o reemplazos temporales, salvo excepciones específicas estipuladas por la ley.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-xl mr-6 mt-1 flex-shrink-0">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Calidad Jurídica y Grado Equivalente</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Es fundamental que ambos funcionarios posean una calidad jurídica compatible y se encuentren en grados equivalentes dentro del escalafón o escala de remuneraciones, asegurando que ninguno sufra un menoscabo o beneficio injustificado en su renta base.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-xl mr-6 mt-1 flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Aprobación de las Jefaturas Directas</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  La permuta debe contar con el Visto Bueno (V.B.) y aprobación formal de los directores de ambos establecimientos de salud involucrados, así como de los respectivos Servicios de Salud(o Direcciones de Salud), garantizando que no se afecte la continuidad del servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-xl mr-6 mt-1 flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Ausencia de Sumarios Administrativos</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Los funcionarios no deben estar sometidos a un sumario administrativo en curso, ni haber sido sancionados con medidas disciplinarias graves en el período reciente estipulado por el Estatuto Administrativo que rige a su institución.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-blue-600 rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">¿Cumples con todos los requisitos?</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Si es así, estás listo para encontrar a tu contraparte ideal. Completa tu perfil y comienza a recibir notificaciones de posibles matches.
            </p>
            <a href="/completar-perfil" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors shadow-md">
              Completar mi Perfil
            </a>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
