import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Footer: React.FC = () => {
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin = user?.isAdmin || user?.email === 'dabrito.dw24@gmail.com';

  return (
    <footer className="bg-slate-50 py-16 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <span className="text-2xl font-black text-blue-700 font-headline block mb-6">PermutaSalud</span>
          <p className="text-slate-500 max-w-sm">
            Red designada exclusivamente para profesionales de salud municipal con el fin de facilitar la búsqueda de una permuta de cargo a nivel regional o nacional.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-slate-900 mb-6 font-headline">Plataforma</h5>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><Link to="/sobre-nosotros" className="hover:text-blue-600 transition-colors">Sobre Nosotros</Link></li>
            <li><Link to="/como-funciona" className="hover:text-blue-600 transition-colors">Cómo Funciona</Link></li>
            <li><Link to="/protocolos-seguridad" className="hover:text-blue-600 transition-colors">Protocolos de Seguridad</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-slate-900 mb-6 font-headline">Legal</h5>
          <ul className="space-y-4 text-slate-500 text-sm">
            <li><Link to="/politica-de-privacidad" className="hover:text-blue-600 transition-colors">Política de Privacidad</Link></li>
            <li><Link to="/terminos-de-servicio" className="hover:text-blue-600 transition-colors">Términos de Servicio</Link></li>
            <li><Link to="/proceso-de-verificacion" className="hover:text-blue-600 transition-colors">Proceso de Verificación</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-slate-400">© 2026 PermutaSalud. Todos los derechos reservados para profesionales de la salud.</p>
        <div className="flex gap-6 items-center">
          {isAdmin && (
            <Link to="/admin" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium" title="Panel de Administración">
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <Link to="#" className="text-slate-400 hover:text-blue-600 transition-colors">Instagram</Link>
          <Link to="https://www.linkedin.com/in/david-brito-ledesma-67678b319" className="text-slate-400 hover:text-blue-600 transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
