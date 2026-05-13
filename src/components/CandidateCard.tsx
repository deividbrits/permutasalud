import React from 'react';
import { Verified, MapPin, Map } from 'lucide-react';
import { motion } from 'motion/react';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  actual: string;
  centroActual: string;
  desired: string;
  image: string;
  bio?: string;
}

const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  return (
    <motion.div 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      className="relative w-full max-w-md aspect-[3/4] cursor-grab active:cursor-grabbing"
    >
      {/* Stack Background Decorations */}
      <div className="absolute inset-x-4 -top-4 bottom-4 bg-slate-200 rounded-xl -z-10 opacity-50"></div>
      <div className="absolute inset-x-8 -top-8 bottom-8 bg-slate-300 rounded-xl -z-20 opacity-30"></div>
      
      {/* Main Active Card */}
      <div className="w-full h-full bg-white/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden flex flex-col relative border border-white/20">
        {/* Profile Image Section */}
        <div className="relative h-3/5 overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={candidate.image}
            alt="Candidate"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Credentials Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              CERTIFICADO
            </span>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-slate-900 leading-tight">
                {candidate.name}
              </h1>
              <p className="text-blue-600 font-semibold text-sm">{candidate.specialty}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg text-teal-600">
              <Verified size={24} fill="currentColor" />
            </div>
          </div>

          {/* Details Bento Layout */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter block mb-1">ACTUAL</span>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                <span className="text-xs font-bold truncate" title={candidate.actual}>{candidate.actual}</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter block mb-1">DESEADO</span>
              <div className="flex items-center gap-1">
                <Map size={14} className="text-teal-500 flex-shrink-0" />
                <span className="text-xs font-bold truncate" title={candidate.desired}>{candidate.desired}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic font-medium">
              Centro Actual: {candidate.centroActual}
            </p>
            {candidate.bio && (
              <div className="mt-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter block mb-1">SOBRE MÍ</span>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                  "{candidate.bio}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
