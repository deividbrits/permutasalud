import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Save, Briefcase, CheckCircle, Target, Globe2, Verified } from 'lucide-react';
import { comunasDeChile, regionesDeChile } from '../data/comunas';

const PersonalProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profession: '',
    flexibilidadDestino: 'comunas',
    comunaDestino_1: '',
    comunaDestino_2: '',
    comunaDestino_3: '',
    comunaDestino_4: '',
    comunaDestino_5: '',
    regionDestino_1: '',
    regionDestino_2: '',
    regionDestino_3: '',
    profileImage: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userStr = localStorage.getItem('userData');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id || user.uid;
      
      try {
        const response = await fetch(`/api/auth/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.isVerified || false);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            profession: data.profession || data.profileData?.profesion || '',
            flexibilidadDestino: data.profileData?.flexibilidadDestino || 'comunas',
            comunaDestino_1: data.profileData?.comunaDestino_1 || '',
            comunaDestino_2: data.profileData?.comunaDestino_2 || '',
            comunaDestino_3: data.profileData?.comunaDestino_3 || '',
            comunaDestino_4: data.profileData?.comunaDestino_4 || '',
            comunaDestino_5: data.profileData?.comunaDestino_5 || '',
            regionDestino_1: data.profileData?.regionDestino_1 || '',
            regionDestino_2: data.profileData?.regionDestino_2 || '',
            regionDestino_3: data.profileData?.regionDestino_3 || '',
            profileImage: data.profileData?.profileImage || '',
            bio: data.profileData?.bio || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFlexibilityChange = (flex: string) => {
    setFormData({
      ...formData,
      flexibilidadDestino: flex
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      setError('La imagen es demasiado grande. Por favor, elige una menor a 800KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    const userStr = localStorage.getItem('userData');
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const userId = user.id || user.uid;

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          profession: formData.profession,
          flexibilidadDestino: formData.flexibilidadDestino,
          comunaDestino_1: formData.comunaDestino_1,
          comunaDestino_2: formData.comunaDestino_2,
          comunaDestino_3: formData.comunaDestino_3,
          comunaDestino_4: formData.comunaDestino_4,
          comunaDestino_5: formData.comunaDestino_5,
          regionDestino_1: formData.regionDestino_1,
          regionDestino_2: formData.regionDestino_2,
          regionDestino_3: formData.regionDestino_3,
          profileImage: formData.profileImage,
          bio: formData.bio,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Update local storage user data for the navbar
        const updatedUser = { ...user, firstName: formData.firstName, lastName: formData.lastName, email: formData.email, profession: formData.profession };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al guardar el perfil');
      }
    } catch (err) {
      setError('Error de red al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto min-h-screen font-inter">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-3xl font-bold uppercase overflow-hidden">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <>{formData.firstName.charAt(0)}{formData.lastName.charAt(0)}</>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight flex items-center gap-2">
              Mi Perfil
              {isVerified && <Verified size={24} className="text-teal-400" title="Perfil Verificado" />}
            </h1>
            <p className="text-blue-100 mt-1">Gestiona tus datos personales y preferencias de permuta</p>
            {!isVerified && (
              <button
                type="button"
                onClick={() => navigate('/verificacion-contrato')}
                className="mt-3 px-4 py-1.5 bg-amber-500/20 text-amber-200 hover:bg-amber-500 hover:text-white border border-amber-500/50 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                Verificar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200">
              <CheckCircle size={20} />
              <span className="font-medium">Perfil actualizado correctamente</span>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Información Personal */}
            <div>
              <h2 className="text-xl font-headline font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User size={20} className="text-blue-600" />
                Información Personal
              </h2>
              
              <div className="mb-8 flex items-center gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-3xl font-bold text-slate-300 uppercase">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-xs font-bold">Cambiar</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">Foto de perfil</h3>
                  <p className="text-xs text-slate-500 max-w-xs">Sube una imagen para que tus colegas te reconozcan. (Máx 800KB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Nombre</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Apellido</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                      type="email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-600">Profesión</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="font-label text-sm font-semibold text-slate-600">Sobre mí (Opcional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none resize-none h-24 text-sm"
                  placeholder="Cuéntanos un poco sobre ti, tu experiencia o por qué buscas permutar..."
                  maxLength={300}
                ></textarea>
                <div className="text-[10px] text-slate-400 text-right">{formData.bio.length}/300</div>
              </div>
            </div>

            {/* Preferencias de Permuta */}
            <div>
              <h2 className="text-xl font-headline font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin size={20} className="text-blue-600" />
                Preferencias de Destino
              </h2>
              <p className="text-sm text-slate-500 mb-4">Puedes actualizar tus preferencias de traslado en cualquier momento.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button type="button" onClick={() => handleFlexibilityChange('comunas')} className={`p-4 border rounded-xl text-left transition-all ${formData.flexibilidadDestino === 'comunas' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <Target className={`mb-2 ${formData.flexibilidadDestino === 'comunas' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Comunas</div>
                    <div className="text-xs text-slate-500">Hasta 5 específicas</div>
                  </button>
                  <button type="button" onClick={() => handleFlexibilityChange('regiones')} className={`p-4 border rounded-xl text-left transition-all ${formData.flexibilidadDestino === 'regiones' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <MapPin className={`mb-2 ${formData.flexibilidadDestino === 'regiones' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Regiones</div>
                    <div className="text-xs text-slate-500">Hasta 3 regiones enteras</div>
                  </button>
                  <button type="button" onClick={() => handleFlexibilityChange('cualquiera')} className={`p-4 border rounded-xl text-left transition-all ${formData.flexibilidadDestino === 'cualquiera' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`}>
                    <Globe2 className={`mb-2 ${formData.flexibilidadDestino === 'cualquiera' ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                    <div className="font-bold text-slate-900 mb-1 text-sm">Cualquier Lugar</div>
                    <div className="text-xs text-slate-500">Todo Chile</div>
                  </button>
                </div>

                {formData.flexibilidadDestino === 'comunas' && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label text-sm font-semibold text-slate-600">Comunas Deseadas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={`destino-comuna-${num}`} className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
                          <MapPin size={16} className="text-slate-400" />
                          <input
                            name={`comunaDestino_${num}`}
                            value={formData[`comunaDestino_${num}` as keyof typeof formData] || ''}
                            onChange={handleChange}
                            className="w-full bg-transparent border-none p-3 focus:ring-0 outline-none"
                            placeholder={`Comuna destino ${num}`}
                            type="text"
                            list="comunas-list"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.flexibilidadDestino === 'regiones' && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label text-sm font-semibold text-slate-600">Regiones Deseadas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div key={`destino-region-${num}`} className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
                          <MapPin size={16} className="text-slate-400" />
                          <select
                            name={`regionDestino_${num}`}
                            value={formData[`regionDestino_${num}` as keyof typeof formData] || ''}
                            onChange={handleChange}
                            className="w-full bg-transparent border-none p-3 focus:ring-0 outline-none text-slate-700"
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

                {formData.flexibilidadDestino === 'cualquiera' && (
                  <div className="pt-2 animate-in fade-in zoom-in">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-200">
                      <Verified size={24} className="flex-shrink-0" />
                      <p className="font-medium text-sm">Has elegido flexibilidad total. Haremos match con cualquier colega que desee ir a tu comuna de origen, sin importar en qué parte de Chile se encuentre actualmente.</p>
                    </div>
                  </div>
                )}
                
                <datalist id="comunas-list">
                  {comunasDeChile.map((comuna) => (
                    <option key={comuna} value={comuna} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'}`}
              >
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PersonalProfile;
