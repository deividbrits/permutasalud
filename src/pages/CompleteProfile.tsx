import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Stethoscope, Verified, ArrowRight, Building2, Globe2, Target } from 'lucide-react';
import { comunasDeChile, regionesDeChile } from '../data/comunas';
import { validateRut, formatRut } from '../utils/rutValidator';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [flexibility, setFlexibility] = useState<'comunas' | 'regiones' | 'cualquiera'>('comunas');
  const [rut, setRut] = useState('');
  const [phone, setPhone] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [profesion, setProfesion] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('userData');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.firstName || u.lastName) setNombreCompleto(`${u.firstName || ''} ${u.lastName || ''}`.trim());
        if (u.rut) setRut(u.rut);
        if (u.phone) setPhone(u.phone);
        if (u.profession) setProfesion(u.profession);
      } catch(e) {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const profileData = Object.fromEntries(form.entries());
    
    if (profileData.rut && !validateRut(profileData.rut as string)) {
      setError('Por favor, ingresa un RUT válido');
      setIsSubmitting(false);
      return;
    }

    // Attempt to get user info from localStorage if present
    const userStr = localStorage.getItem('userData');
    let userId = null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        userId = u.id || u.uid;
      } catch (err) {
        // ignore
      }
    }

    if (!userId) {
      console.warn("Usuario no autenticado, saltando guardado en DB y avanzando para pruebas...");
      navigate('/verificacion-contrato');
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData }),
      });

      if (response.ok) {
        navigate('/verificacion-contrato');
      } else {
        let msg = 'Error al guardar el perfil';
        try {
          const data = await response.json();
          msg = data.message || msg;
        } catch(e) {
          // ignore HTML errors
        }
        setError(msg);
      }
    } catch (err) {
      setError('Error de red al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = async () => {
    setError('');
    setIsSubmitting(true);

    const form = document.getElementById('profileForm') as HTMLFormElement;
    if (!form) {
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData(form);
    const profileData = Object.fromEntries(formData.entries());

    if (profileData.rut && !validateRut(profileData.rut as string)) {
      setError('Por favor, ingresa un RUT válido');
      setIsSubmitting(false);
      return;
    }

    const userStr = localStorage.getItem('userData');
    let userId = null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        userId = u.id || u.uid;
      } catch (err) {}
    }

    if (!userId) {
      setError('Usuario no autenticado, no se puede guardar el borrador.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isDraft: true, ...profileData }),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        let msg = 'Error al guardar el borrador';
        try {
          const data = await response.json();
          msg = data.message || msg;
        } catch(e) {}
        setError(msg);
      }
    } catch (err) {
      setError('Error de red al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Left Column: Contextual Guidance */}
      <aside className="md:w-1/3 flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="font-headline font-extrabold text-4xl text-slate-900 tracking-tight leading-tight">
            Completa tu perfil profesional.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Únete a la red de profesionales de la salud que buscan movilidad clínica. Tus datos nos ayudan a encontrar el match perfecto para tu traslado.
          </p>
        </div>
        {/* Progress Tracker */}
        <div className="flex flex-col gap-6 py-8 border-l-2 border-slate-200 pl-6">
          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
            <span className="font-headline font-bold text-blue-600">Identidad Personal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">2</div>
            <span className="font-headline font-medium">Verificación de Contrato</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">3</div>
            <span className="font-headline font-medium">Intención de Movilidad</span>
          </div>
        </div>
        {/* Decorative Visual */}
        <div className="hidden md:block rounded-xl overflow-hidden shadow-sm">
          <div className="bg-blue-50 p-6 space-y-4">
            <Stethoscope className="text-teal-600" size={24} fill="currentColor" />
            <p className="text-sm font-medium text-teal-700 italic">
              "Encontrar el lugar adecuado para ejercer la profesión es más que un cambio de trabajo; se trata de comunidad y de impacto en la atención al paciente."
            </p>
          </div>
          <img
            src="https://picsum.photos/seed/corridor2/600/400"
            alt="Hospital Interior"
            className="w-full h-48 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </aside>

      {/* Right Column: Registration Form */}
      <section className="md:w-2/3">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-2xl border border-slate-100">
          <form id="profileForm" className="space-y-10" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-4 border border-red-200">
                {error}
              </div>
            )}
            {/* Section: Identity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-xl text-slate-900">Identidad y Credenciales</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">PASO 1 DE 3</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Nombre Completo</label>
                  <input
                    name="nombreCompleto"
                    required
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body"
                    placeholder="Dra. Juana Pérez"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">RUT</label>
                  <input
                    name="rut"
                    required
                    value={rut}
                    onChange={(e) => setRut(formatRut(e.target.value))}
                    className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body"
                    placeholder="12345678-9"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Teléfono</label>
                  <input
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body"
                    placeholder="+56 9 1234 5678"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Categoría Profesional</label>
                  <select name="categoriaProfesional" required className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body appearance-none">
                    <option disabled selected value="">Seleccionar Categoría (A-F)</option>
                    <option>Categoría A (Médicos/Dentistas Especialistas)</option>
                    <option>Categoría B (Profesionales de la Salud - Enfermeros/Matronas)</option>
                    <option>Categoría C (Técnicos)</option>
                    <option>Categoría D (Administrativos)</option>
                    <option>Categoría E (Auxiliares)</option>
                    <option>Categoría F (Servicios Generales)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Profesión</label>
                  <input
                    name="profesion"
                    required
                    value={profesion}
                    onChange={(e) => setProfesion(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body"
                    placeholder="Ej. Enfermero"
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Section: Professional Level */}
            <div className="space-y-6">
              <h2 className="font-headline font-bold text-xl text-slate-900">Experiencia Laboral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Nivel de Carrera Actual (Bienios)</label>
                  <input
                    name="bienios"
                    required
                    className="w-full bg-slate-100 border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 transition-all font-body"
                    max="15"
                    min="0"
                    placeholder="Ej., 4"
                    type="number"
                  />
                  <p className="text-[10px] text-slate-400">Especifique el número de bienios completados.</p>
                </div>
              </div>
            </div>

            {/* Section: Location Origin */}
            <div className="space-y-6">
              <h2 className="font-headline font-bold text-xl text-slate-900">Lugar de Origen</h2>
              <p className="text-sm text-slate-500 mb-4">¿Dónde trabajas actualmente?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Comuna Actual</label>
                  <div className="flex items-center bg-slate-100 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
                    <MapPin size={18} className="text-slate-400" />
                    <input
                      name="comunaActual"
                      required
                      className="w-full bg-transparent border-none p-3 focus:ring-0 font-body"
                      placeholder="Busca tu comuna actual..."
                      type="text"
                      list="comunas-list"
                    />
                    <datalist id="comunas-list">
                      {comunasDeChile.map((comuna) => (
                        <option key={comuna} value={comuna} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Centro de Salud Específico</label>
                  <div className="flex items-center bg-slate-100 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
                    <Building2 size={18} className="text-slate-400" />
                    <input
                      name="centroSaludActual"
                      required
                      className="w-full bg-transparent border-none p-3 focus:ring-0 font-body"
                      placeholder="Ej: CESFAM San Juan"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Location Destination */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <h2 className="font-headline font-bold text-xl text-slate-900">Preferencias de Destino</h2>
              <p className="text-sm text-slate-500 mb-4">¿Qué tan flexible eres para trasladarte?</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setFlexibility('comunas')} className={`p-4 border rounded-xl text-left transition-all ${flexibility === 'comunas' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <Target className={`mb-2 ${flexibility === 'comunas' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Comunas</div>
                    <div className="text-xs text-slate-500">Hasta 5 específicas</div>
                  </button>
                  <button type="button" onClick={() => setFlexibility('regiones')} className={`p-4 border rounded-xl text-left transition-all ${flexibility === 'regiones' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <MapPin className={`mb-2 ${flexibility === 'regiones' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Regiones</div>
                    <div className="text-xs text-slate-500">Hasta 3 regiones enteras</div>
                  </button>
                  <button type="button" onClick={() => setFlexibility('cualquiera')} className={`p-4 border rounded-xl text-left transition-all ${flexibility === 'cualquiera' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <Globe2 className={`mb-2 ${flexibility === 'cualquiera' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Cualquier Lugar</div>
                    <div className="text-xs text-slate-500">Todo Chile</div>
                  </button>
                </div>
                
                <input type="hidden" name="flexibilidadDestino" value={flexibility} />

                {flexibility === 'comunas' && (
                  <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label text-sm font-semibold text-slate-600">Comunas Deseadas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={`destino-comuna-${num}`} className="flex items-center bg-slate-100 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
                          <MapPin size={18} className="text-slate-400" />
                          <input
                            name={`comunaDestino_${num}`}
                            className="w-full bg-transparent border-none p-3 focus:ring-0 font-body"
                            placeholder={`Comuna ${num}...`}
                            type="text"
                            list="comunas-list"
                            required={num === 1}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {flexibility === 'regiones' && (
                  <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label text-sm font-semibold text-slate-600">Regiones Deseadas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div key={`destino-region-${num}`} className="flex items-center bg-slate-100 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
                          <MapPin size={18} className="text-slate-400" />
                          <select
                            name={`regionDestino_${num}`}
                            className="w-full bg-transparent border-none p-3 focus:ring-0 font-body text-slate-700"
                            required={num === 1}
                          >
                            <option value="">Seleccionar Región {num}...</option>
                            {regionesDeChile.map((region) => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {flexibility === 'cualquiera' && (
                  <div className="pt-4 pb-2 animate-in fade-in zoom-in">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-200">
                      <Verified size={24} className="flex-shrink-0" />
                      <p className="font-medium text-sm">Has elegido flexibilidad total. Haremos match con cualquier colega que desee ir a tu comuna de origen, sin importar en qué parte de Chile se encuentre actualmente.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
              <button 
                className="text-slate-500 font-headline font-bold hover:text-blue-600 transition-colors px-6 py-3 disabled:opacity-50" 
                type="button"
                onClick={handleDraft}
                disabled={isSubmitting}
              >
                Guardar como Borrador
              </button>
              <button
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-10 py-4 ${isSubmitting ? 'bg-slate-300' : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-blue-500/20'} text-white font-headline font-extrabold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2`}
                type="submit"
              >
                {isSubmitting ? 'Guardando...' : 'Crear Perfil Profesional'} {!isSubmitting && <ArrowRight size={20} />}
              </button>
            </div>
          </form>
        </div>
        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-500">
          <Verified className="text-teal-600" size={24} fill="currentColor" />
          <p className="text-xs font-medium max-w-sm text-center">
            Tus datos se manejan según los estándares de privacidad clínica. PermutaSalud solo comparte tu perfil profesional con matches potenciales verificados.
          </p>
        </div>
      </section>
    </main>
  );
};

export default CompleteProfile;
