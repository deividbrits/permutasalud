import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBadge, Trash2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;
  const userId = user?.id || user?.user?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    if (!userId) {
      setDeleteError('No se encontró la sesión del usuario. Por favor inicia sesión nuevamente.');
      return;
    }

    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta de forma permanente? Se borrarán todos tus datos de la plataforma y esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la cuenta. El servidor devolvió un error.');
      }

      // Limpiar local storage y redirigir al inicio
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      alert('Tu cuenta y todos tus datos han sido eliminados exitosamente de PermutaSalud.');
      
      // Forzamos la redirección usando window.location para que Navbar pierda el state del usuario de inmediato
      window.location.href = '/';
    } catch (error: any) {
      setDeleteError(error.message || 'Ocurrió un error al intentar eliminar la cuenta.');
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-headline font-black text-3xl md:text-4xl text-slate-900 mb-8">
          Ajustes de Usuario
        </h1>

        <div className="space-y-6">
          
          {/* Re-verificación de Contrato */}
          <motion.div 
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileBadge size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 mb-3 font-headline">Actualizar Verificación de Contrato</h2>
                <p className="text-slate-600 mb-5 leading-relaxed">
                  ¿Cambió tu condición contractual, te trasladaron de establecimiento o renovaste contrato recientemente? Puedes volver a subir tu documento para actualizar tu estado de verificación y asegurarte de mantener tu perfil activo y visible en la plataforma de permutas.
                </p>
                <Link to="/verificacion-contrato" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  Volver a Verificar Contrato
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Eliminar Cuenta */}
          <motion.div 
            className="bg-white p-6 rounded-3xl shadow-sm border border-red-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 mb-3 font-headline">Zona de Peligro: Eliminar Cuenta</h2>
                <p className="text-slate-600 mb-5 leading-relaxed">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor asegúrate de estar completamente seguro. Perderás permanentemente todos tus "matches", tus preferencias guardadas y tu perfil desaparecerá inmediatamente de los resultados de búsqueda.
                </p>
                
                {deleteError && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm font-medium border border-red-100">
                    {deleteError}
                  </div>
                )}

                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={20} />
                  {isDeleting ? 'Eliminando cuenta...' : 'Eliminar mi cuenta definitivamente'}
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
};

export default Settings;
