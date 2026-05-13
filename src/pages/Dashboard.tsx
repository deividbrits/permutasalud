import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, MapPin, Stethoscope, Verified, X, Bolt, Heart } from 'lucide-react';
import CandidateCard, { Candidate } from '../components/CandidateCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userDataString);
    const userId = userData.id || userData.uid;

    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/auth/candidates/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (err) {
        console.error('Error fetching matches', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (currentIndex >= candidates.length) return;
    const targetId = candidates[currentIndex].id;
    
    // Optimistically go to next
    setCurrentIndex((prev) => prev + 1);

    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return;
    const userData = JSON.parse(userDataString);
    const userId = userData.id || userData.uid;

    try {
      await fetch('/api/auth/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId, action })
      });
    } catch (error) {
      console.error('Error saving swipe action:', error);
    }
  };

  const currentCandidate = candidates[currentIndex];
  return (
    <div className="flex pt-16 min-h-screen bg-slate-50">
      {/* SideNavBar / Filters */}
      <aside className="h-screen w-64 fixed left-0 top-16 bg-white flex flex-col py-8 px-4 gap-4 hidden lg:flex border-r border-slate-100">
        <div className="mb-6 px-2">
          <h2 className="font-headline text-lg font-bold text-slate-900">Filtros</h2>
          <p className="text-xs text-slate-500">Refina tu búsqueda</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 py-3 px-4 bg-blue-50 text-blue-700 font-bold rounded-r-full hover:pl-6 transition-all duration-200">
            <Map size={20} />
            <span className="font-inter text-sm font-medium">Región</span>
          </button>
          <button className="flex items-center gap-3 py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-r-full hover:pl-6 transition-all duration-200">
            <MapPin size={20} />
            <span className="font-inter text-sm font-medium">Comuna</span>
          </button>
          <button className="flex items-center gap-3 py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-r-full hover:pl-6 transition-all duration-200">
            <Stethoscope size={20} />
            <span className="font-inter text-sm font-medium">Categoría</span>
          </button>
        </nav>
        <div className="mt-auto p-4 bg-slate-50 rounded-xl">
          <p className="text-xs font-semibold mb-3 text-slate-600">Acciones Rápidas</p>
          <button className="w-full py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl font-headline font-bold text-sm shadow-md hover:shadow-lg transition-all">
            Aplicar Filtros
          </button>
        </div>
      </aside>

      {/* Main Content (Canvas) */}
      <main className="flex-1 lg:ml-64 p-6 md:p-12 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-slate-500 font-medium">Buscando matches compatibles...</div>
        ) : currentCandidate ? (
          <>
            <CandidateCard candidate={currentCandidate} />

            {/* Swipe Action Buttons */}
            <div className="flex gap-8 mt-10">
              <button onClick={() => handleSwipe('pass')} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 border-4 border-red-50 hover:scale-110 transition-transform active:scale-95">
                <X size={30} />
              </button>
              {/* <button className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 border-4 border-blue-50 hover:scale-110 transition-transform active:scale-95 relative group">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 scale-125 group-hover:scale-150 transition-transform duration-700 blur-xl opacity-50"></div>
                <Bolt size={40} fill="currentColor" />
              </button> */}
              <button onClick={() => handleSwipe('like')} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-teal-500 border-4 border-teal-50 hover:scale-110 transition-transform active:scale-95">
                <Heart size={30} fill="currentColor" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-sm border border-slate-100">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-blue-500" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-slate-900 mb-2">No hay más candidatos</h3>
            <p className="text-slate-500">Has revisado todos los perfiles compatibles en este momento. Te notificaremos cuando haya nuevos.</p>
          </div>
        )}

        {/* Footer / Stats */}
        <div className="mt-12 flex gap-12 text-slate-400 font-label text-xs uppercase tracking-widest font-bold">
          <div className="flex flex-col items-center">
            <span className="text-slate-900 text-lg mb-1">{Math.max(0, candidates.length - currentIndex)}</span>
            <span>RESTANTES</span>
          </div>
          <div className="w-[1px] bg-slate-200 h-10 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="text-slate-900 text-lg mb-1">{candidates.length}</span>
            <span>MATCHES</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
