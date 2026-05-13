import React, { useState, useEffect } from 'react';
import { CheckCircle, Home, MapPin, MessageSquare, Search, AlertCircle, X, Mail, Copy, Check, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Matches: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      const userStr = localStorage.getItem('userData');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id || user.uid;
      
      try {
        const response = await fetch(`/api/auth/matches/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        } else {
          setError('No pudimos cargar tus matches en este momento.');
        }
      } catch (err) {
        setError('Error de conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [navigate]);

  if (loading) {
    return (
      <main className="lg:pl-64 pt-24 pb-12 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="lg:pl-64 pt-24 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Mis Matches</h1>
          <p className="text-slate-500 max-w-2xl">
            Conéctate con profesionales que comparten tus objetivos de traslado. Estos matches mutuos representan funcionarios que actualmente están en tu zona de interés y desean trasladarse a la tuya.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 md:col-span-2 p-8 rounded-xl bg-white shadow-sm border border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-blue-50/30">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2 block">RESULTADOS DE BÚSQUEDA</span>
              <h3 className="font-headline text-3xl font-bold text-slate-900">{matches.length} Matches Mutuos</h3>
              <p className="text-slate-500 mt-1">Con filtro estricto de Profesión y Categoría</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <CheckCircle size={32} fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="p-8 rounded-xl bg-blue-600 text-white shadow-lg flex flex-col justify-between">
            <CheckCircle size={32} className="text-white/60" />
            <div>
              <h3 className="font-headline text-xl font-bold">Siempre Actualizados</h3>
              <p className="text-white/80 text-sm">Buscamos nuevas coincidencias en tiempo real.</p>
            </div>
          </div>
        </div>

        {matches.length === 0 && !error ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no hay coincidencias</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              En este momento no hay colegas con tu misma profesión y categoría que deseen permutar hacia tu comuna de origen desde tus destinos deseados.
            </p>
            <button 
              onClick={() => navigate('/profile')} 
              className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Ampliar mis preferencias de destino
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {matches.map((match, index) => (
              <div key={match.id || index} className="group bg-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden border border-slate-100">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-l-xl"></div>
                <div className="relative">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-20 h-20 rounded-xl object-cover transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle size={14} fill="currentColor" />
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h4 className="font-headline text-xl font-bold text-slate-900">{match.name}</h4>
                    <span className="inline-flex px-2.5 py-0.5 rounded-sm bg-teal-100 text-[10px] font-bold uppercase tracking-widest text-teal-800 self-center">
                      {match.role}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3 font-medium capitalize">{match.specialty}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Home size={16} className="text-blue-500" />
                      <span>Origen: <span className="font-bold text-slate-900">{match.actual}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <MapPin size={16} className="text-teal-500" />
                      <span>Busca: <span className="font-bold text-slate-900">{match.desired}</span></span>
                    </div>
                  </div>
                  {match.centroActual && (
                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 md:justify-start justify-center">
                      <MapPin size={12} />
                      Centro: {match.centroActual}
                    </p>
                  )}
                  {match.bio && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 md:text-left text-center italic max-w-lg">
                      "{match.bio}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setSelectedProfile(match)}
                    className="px-6 py-2.5 bg-slate-100 text-blue-600 font-bold rounded-xl text-sm transition-all hover:bg-slate-200"
                  >
                    Ver Perfil
                  </button>
                  <button 
                    onClick={() => setSelectedContact(match)}
                    className="px-6 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-12 text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Search className="text-slate-300 mx-auto mb-4" size={48} />
            <p className="text-slate-500 font-medium">¿Buscas más opciones de traslado?</p>
            <button onClick={() => navigate('/profile')} className="mt-4 text-blue-600 font-bold hover:underline">
              Ampliar mis destinos o nivel de flexibilidad
            </button>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Datos de Contacto</h3>
              <button 
                onClick={() => { setSelectedContact(null); setCopied(false); }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedContact.image} 
                  alt={selectedContact.name} 
                  className="w-16 h-16 rounded-full border-2 border-slate-100" 
                />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedContact.name}</h4>
                  <p className="text-sm text-slate-500 capitalize">{selectedContact.specialty}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Correo Electrónico
                </p>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-100 mb-4">
                  <span className="text-slate-700 font-medium truncate mr-2">{selectedContact.email}</span>
                  <button 
                    onClick={() => handleCopyEmail(selectedContact.email)}
                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition-colors flex-shrink-0"
                    title="Copiar correo"
                  >
                    {copied ? <Check size={18} className="text-teal-600" /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Teléfono
                </p>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-100">
                  <span className="text-slate-700 font-medium truncate mr-2">{selectedContact.phone || 'No especificado'}</span>
                </div>
              </div>
              
              <button 
                onClick={() => { setSelectedContact(null); setCopied(false); }}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 relative">
            <button 
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 text-slate-800 backdrop-blur-md rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-teal-500">
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-center">
                <img 
                  src={selectedProfile.image} 
                  alt={selectedProfile.name} 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-headline font-bold text-slate-900 mb-1">{selectedProfile.name}</h3>
                <p className="text-sm font-medium text-teal-600 uppercase tracking-widest">{selectedProfile.role}</p>
                <p className="text-slate-500 capitalize">{selectedProfile.specialty}</p>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <User size={16} className="text-blue-500" />
                   Sobre mí
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  {selectedProfile.bio ? `"${selectedProfile.bio}"` : "Este usuario aún no ha agregado una biografía a su perfil."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Matches;
