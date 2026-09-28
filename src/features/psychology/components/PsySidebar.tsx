import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

export function PsySidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#0a1526] text-white'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 justify-between">
      <div>
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-blue-600">🏥</span> UniCare
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">UNINASSAU Saúde</p>
        </div>

        <nav className="px-4 mt-2">
          <h2 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
            Serviço de Psicologia (SPA)
          </h2>
          <ul className="space-y-2">
            <li>
              <NavLink to="/psi/recepcao" className={getLinkStyle}>
                <span>📅</span> Agenda & Recepção
              </NavLink>
            </li>
            <li>
              <NavLink to="/psi/prontuario" className={getLinkStyle}>
                <span>🧠</span> Prontuário Psicológico
              </NavLink>
            </li>
            <li>
              <NavLink to="/psi/supervisao" className={getLinkStyle}>
                <span>🛡️</span> Supervisão Docente
              </NavLink>
            </li>
          </ul>

          <div className="my-6 border-t border-gray-100"></div>

          <h2 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
            Módulo Odontológico
          </h2>
          <ul className="space-y-2">
            <li>
              <NavLink to="/recepcao" className={getLinkStyle}>
                <span>📅</span> Recepção Odonto
              </NavLink>
            </li>
            <li>
              <NavLink to="/ficha-odonto" className={getLinkStyle}>
                <span>🦷</span> Ficha Odontológica
              </NavLink>
            </li>
            <li>
              <NavLink to="/supervisao" className={getLinkStyle}>
                <span>🛡️</span> Supervisão Odonto
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Identificação do Usuário Logado */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-gray-900 truncate">{user?.nome || 'Usuário'}</p>
          <p className="text-[10px] text-gray-500 capitalize">
            Perfil: <strong className="text-blue-700">{user?.perfil}</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-600 hover:text-red-800 font-bold p-1 hover:bg-red-50 rounded"
          title="Encerrar Sessão"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}