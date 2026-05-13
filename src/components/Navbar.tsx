import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Menu, Search, Settings, HelpCircle, Mail, LogOut, BadgeCheck, ShieldAlert } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      
      const userId = user.id || user.uid;
      if (!userId) return;

      try {
        const response = await fetch(`/api/auth/matches/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setMatchesCount(data.length || 0);
        }
      } catch (err) {
        console.error('Error fetching matches for notifications:', err);
      }
    };
    
    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated, user?.id, user?.uid]);

  if (isAuthPage) return null;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Panel', path: '/dashboard' },
    { name: 'Mis Matches', path: '/matches' },
    { name: 'Perfil', path: '/profile' },
  ];

  const userName = user?.name || user?.user?.name || user?.email?.split('@')[0] || "Usuario";

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="font-headline font-extrabold text-xl tracking-tight text-slate-900">PermutaSalud</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-600'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar traslados..."
            className="bg-transparent border-none text-sm focus:ring-0 w-40"
          />
        </div> */}
        <div className="relative" ref={notificationRef}>
          <button 
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {matchesCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">Notificaciones</p>
              </div>
              
              <div className="py-2">
                {matchesCount > 0 ? (
                  <Link 
                    to="/matches" 
                    onClick={() => setShowNotifications(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 mt-0.5">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">¡Nuevos matches disponibles!</p>
                      <p className="text-xs text-slate-500 mt-1">Tienes {matchesCount} {matchesCount === 1 ? 'match' : 'matches'} mutuos esperando a ser contactados.</p>
                      <span className="text-xs font-bold text-blue-600 mt-2 inline-block">Ver mis matches</span>
                    </div>
                  </Link>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <Bell size={24} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No tienes notificaciones nuevas por ahora.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <div
              className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase overflow-hidden">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-slate-700 capitalize">
                {userName}
                {user?.isVerified && <BadgeCheck size={16} className="text-teal-500" title="Perfil Verificado" />}
              </span>
            </div>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-medium text-slate-900 capitalize flex items-center gap-1">
                    {userName}
                    {user?.isVerified && <BadgeCheck size={16} className="text-teal-500" title="Perfil Verificado" />}
                  </p>
                </div>

                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <User size={16} />
                  Perfil
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Settings size={16} />
                  Ajustes
                </Link>
                <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <HelpCircle size={16} />
                  Centro de Ayuda
                </Link>
                <Link to="/contact" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Mail size={16} />
                  Contáctanos
                </Link>

                {(user?.isAdmin || user?.email === 'dabrito.dw24@gmail.com') && (
                  <>
                    <div className="border-t border-slate-100 my-1 mt-2"></div>

                    <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <ShieldAlert size={16} />
                      Panel Admin
                    </Link>
                  </>
                )}

                <div className="border-t border-slate-100 my-1 mt-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:flex items-center justify-center px-3 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-lg transition-all">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="hidden sm:flex items-center justify-center px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm">
              Regístrate
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex sm:hidden items-center justify-center text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all cursor-pointer">
              <User size={18} />
            </div>
          </div>
        )}

        <button className="md:hidden p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
