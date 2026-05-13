import React, { useState, useEffect } from 'react';
import { Trash2, Search, Filter, ShieldAlert, Mail, MapPin, Briefcase, UserX, ShieldCheck, Shield, CheckCircle, UserCheck } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  notifiedMatches?: string[];
  savedMatches?: string[];
  profileData?: {
    comunaActual?: string;
    profesion?: string;
    telefono?: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'matches'>('users');

  const userDataString = localStorage.getItem('userData');
  const currentUser = userDataString ? JSON.parse(userDataString) : null;
  const isSuperAdmin = currentUser?.email === 'dabrito.dw24@gmail.com';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/profile/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    if (!isSuperAdmin) return;
    
    const action = currentAdminStatus ? 'quitar' : 'otorgar';
    if (!window.confirm(`¿Estás seguro de que deseas ${action} privilegios de administrador a este usuario?`)) {
      return;
    }

    try {
      const response = await fetch('/api/auth/toggle-admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: currentUser.email,
          targetUserId: userId,
          isAdmin: !currentAdminStatus
        })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !currentAdminStatus } : u));
      } else {
        const data = await response.json();
        alert(data.message || 'Error al cambiar los permisos');
      }
    } catch (error) {
      console.error('Error toggling admin:', error);
      alert('Error de conexión');
    }
  };

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'quitar la verificación' : 'verificar';
    if (!window.confirm(`¿Estás seguro de que deseas ${action} a este usuario?`)) {
      return;
    }

    try {
      const response = await fetch('/api/auth/toggle-verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: currentUser.email,
          targetUserId: userId,
          isVerified: !currentStatus
        })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !currentStatus } : u));
      } else {
        const data = await response.json();
        alert(data.message || 'Error al cambiar la verificación');
      }
    } catch (error) {
      console.error('Error toggling verify:', error);
      alert('Error de conexión');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userProfession = (user.profileData?.profesion || user.profession || '').toLowerCase();
    const matchesProfession = filterProfession === '' || userProfession.includes(filterProfession.toLowerCase());
    
    const userLocation = (user.profileData?.comunaActual || '').toLowerCase();
    const matchesLocation = filterLocation === '' || userLocation.includes(filterLocation.toLowerCase());

    return matchesSearch && matchesProfession && matchesLocation;
  });

  const uniqueProfessions = Array.from(new Set(users.map(u => u.profileData?.profesion || u.profession).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(users.map(u => u.profileData?.comunaActual).filter(Boolean)));

  // Calcular Matches Producidos
  const matchPairs: { userA: User; userB: User; type: string }[] = [];
  const processedPairs = new Set<string>();

  users.forEach(userA => {
    // Matches del Sistema (Algorítmicos)
    if (userA.notifiedMatches && Array.isArray(userA.notifiedMatches)) {
      userA.notifiedMatches.forEach(targetId => {
        const pairId = [userA.id, targetId].sort().join('-');
        if (!processedPairs.has(pairId)) {
          const userB = users.find(u => u.id === targetId);
          if (userB && userB.notifiedMatches?.includes(userA.id)) {
            matchPairs.push({ userA, userB, type: 'Algorítmico' });
            processedPairs.add(pairId);
          }
        }
      });
    }

    // Matches Mutuos (Swipes)
    if (userA.savedMatches && Array.isArray(userA.savedMatches)) {
      userA.savedMatches.forEach(targetId => {
        const pairId = [userA.id, targetId].sort().join('-');
        if (!processedPairs.has(pairId)) {
          const userB = users.find(u => u.id === targetId);
          if (userB && userB.savedMatches?.includes(userA.id)) {
            matchPairs.push({ userA, userB, type: 'Mutuo (Swipe)' });
            processedPairs.add(pairId);
          }
        }
      });
    }
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acceso Denegado</h2>
          <p className="text-slate-600">No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldAlert className="text-blue-600" size={32} />
              Panel de Administración
            </h1>
            <p className="text-slate-600 mt-2">Gestiona los usuarios de la plataforma PermutaSalud.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="text-slate-500 font-medium">Total de usuarios:</span>
            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full font-bold">{users.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 mb-8">
          <button
            className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios Registrados
          </button>
          <button
            className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'matches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            Matches Producidos
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">{matchPairs.length}</span>
          </button>
        </div>

        {activeTab === 'users' ? (
          <>
            {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="pl-10 w-full rounded-xl border border-slate-300 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="text-slate-400" size={18} />
              </div>
              <select
                className="pl-10 w-full rounded-xl border border-slate-300 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                value={filterProfession}
                onChange={(e) => setFilterProfession(e.target.value)}
              >
                <option value="">Todas las profesiones</option>
                {uniqueProfessions.map((prof, idx) => (
                  <option key={idx} value={prof}>{prof}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="text-slate-400" size={16} />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="text-slate-400" size={18} />
              </div>
              <select
                className="pl-10 w-full rounded-xl border border-slate-300 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="">Todos los lugares de origen</option>
                {uniqueLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="text-slate-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No se encontraron usuarios</h3>
              <p className="text-slate-500">Intenta con otros términos de búsqueda o filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <th className="p-4 pl-6">Usuario</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Profesión</th>
                    <th className="p-4">Lugar de Origen</th>
                    <th className="p-4 text-right pr-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase shrink-0">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 capitalize flex items-center gap-2">
                              {user.firstName} {user.lastName}
                              {user.isVerified && <CheckCircle size={16} className="text-teal-500" title="Usuario Verificado" />}
                              {user.isAdmin && <ShieldCheck size={16} className="text-blue-500" title="Administrador" />}
                            </div>
                            <div className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={14} className="text-slate-400" />
                            {user.email}
                          </div>
                          {user.profileData?.telefono && (
                            <div className="text-slate-500 text-xs">
                              Tel: {user.profileData.telefono}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                          {user.profileData?.profesion || user.profession || 'No especificado'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-700 text-sm capitalize">
                          {user.profileData?.comunaActual ? (
                            <>
                              <MapPin size={14} className="text-slate-400" />
                              {user.profileData.comunaActual}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">No especificado</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleVerify(user.id, !!user.isVerified)}
                            className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors group ${
                              user.isVerified 
                                ? 'text-teal-600 hover:bg-teal-50' 
                                : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'
                            }`}
                            title={user.isVerified ? "Quitar verificación" : "Verificar usuario"}
                          >
                            <UserCheck size={18} className="group-hover:scale-110 transition-transform" />
                          </button>
                          {isSuperAdmin && user.email !== 'dabrito.dw24@gmail.com' && (
                            <button
                              onClick={() => handleToggleAdmin(user.id, !!user.isAdmin)}
                              className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors group ${
                                user.isAdmin 
                                  ? 'text-blue-600 hover:bg-blue-50' 
                                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                              title={user.isAdmin ? "Quitar administrador" : "Hacer administrador"}
                            >
                              <Shield size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Detalle de Matches</h2>
            {matchPairs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Aún no hay matches</h3>
                <p className="text-slate-500">Ningún usuario ha hecho match todavía en el sistema.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matchPairs.map((pair, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors shadow-sm bg-slate-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        pair.type === 'Algorítmico' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {pair.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 relative">
                      {/* Línea conectora */}
                      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 -z-10"></div>
                      
                      {/* User A */}
                      <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm z-10">
                        <p className="font-bold text-slate-900 capitalize truncate text-sm">{pair.userA.firstName} {pair.userA.lastName}</p>
                        <p className="text-xs text-slate-500 truncate" title={pair.userA.email}>{pair.userA.email}</p>
                        <p className="text-xs text-slate-400 mt-1 capitalize"><MapPin size={10} className="inline mr-1"/>{pair.userA.profileData?.comunaActual || 'Sin comuna'}</p>
                        <p className="text-xs font-medium text-slate-600 mt-1 truncate">{pair.userA.profileData?.profesion || pair.userA.profession}</p>
                      </div>

                      {/* Icono Conector */}
                      <div className="shrink-0 w-8 h-8 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center z-10">
                        <CheckCircle size={14} className="text-blue-600" />
                      </div>

                      {/* User B */}
                      <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm z-10 text-right">
                        <p className="font-bold text-slate-900 capitalize truncate text-sm">{pair.userB.firstName} {pair.userB.lastName}</p>
                        <p className="text-xs text-slate-500 truncate" title={pair.userB.email}>{pair.userB.email}</p>
                        <p className="text-xs text-slate-400 mt-1 capitalize"><MapPin size={10} className="inline mr-1"/>{pair.userB.profileData?.comunaActual || 'Sin comuna'}</p>
                        <p className="text-xs font-medium text-slate-600 mt-1 truncate">{pair.userB.profileData?.profesion || pair.userB.profession}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
