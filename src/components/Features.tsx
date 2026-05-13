import React from 'react';
import { Share2, Building2, Handshake } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 bg-slate-100 p-8 rounded-[2rem] flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Share2 size={30} />
          </div>
          <h3 className="font-headline font-bold text-2xl text-slate-900 mb-3">
            Credenciales Verificadas
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Tu intercambio es con seguridad y confianza.
          </p>
        </div>
      </div>
      <div className="bg-teal-50 p-8 rounded-[2rem] border border-teal-100">
        <Building2 className="text-teal-600 mb-4" size={40} />
        <h4 className="font-headline font-bold text-xl text-teal-900 mb-2">
          Movilidad Regional
        </h4>
        <p className="text-slate-600 text-sm">
          Intercambios profesionales a nivel regional o nacional.
        </p>
      </div>
      <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
        <Handshake className="text-blue-600 mb-4" size={40} />
        <h4 className="font-headline font-bold text-xl text-blue-900 mb-2">
          Match Directo
        </h4>
        <p className="text-slate-600 text-sm">
          Hace Match con la persona precisa.
        </p>
      </div>
      <div className="md:col-span-2 relative h-48 rounded-[2rem] overflow-hidden">
        <img
          src="https://picsum.photos/seed/corridor/1200/400"
          alt="Hospital Interior"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
          <span className="text-white font-headline font-bold text-lg">
            Únete a más de 12,000 profesionales de la salud
          </span>
        </div>
      </div>
    </div>
  );
};

export default Features;
