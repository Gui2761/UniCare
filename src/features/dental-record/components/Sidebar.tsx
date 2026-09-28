import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
} from '../../../components/icons/CorporateIcons';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 justify-between select-none z-30">
      <div>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              UC
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                UniCare Health
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                UNINASSAU • Hospital-Escola
              </p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-6">
          <div>
            <h2 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Odontologia Integrada
            </h2>
            <ul className="space-y-1">
              <li>
                <NavLink to="/recepcao" className={getLinkStyle}>
                  <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Recepção Odontológica</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/ficha-odonto" className={getLinkStyle}>
                  <DocumentTextIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Ficha Clínica & Odontograma</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/supervisao" className={getLinkStyle}>
                  <ShieldCheckIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Supervisão Odontológica</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Psicologia Clínica (SPA)
            </h2>
            <ul className="space-y-1">
              <li>
                <NavLink to="/psi/recepcao" className={getLinkStyle}>
                  <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Agenda & Triagem</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/psi/prontuario" className={getLinkStyle}>
                  <DocumentTextIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Prontuário Psicológico</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/psi/supervisao" className={getLinkStyle}>
                  <ShieldCheckIcon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Supervisão SPA</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {(user?.perfil === 'rt' || user?.perfil === 'supervisor') && (
            <div>
              <h2 className="px-3 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5" />
                <span>Gestão RT & Compliance</span>
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/rt/relatorios" className={getLinkStyle}>
                    <ChartBarIcon className="w-4 h-4 shrink-0 text-indigo-600" />
                    <span>Indicadores & Custódia Legal</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* Identificação do Usuário Logado */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate leading-snug">{user?.nome || 'Usuário'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate">
              {user?.perfil} • {user?.matricula}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Encerrar Sessão Corporativa"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}