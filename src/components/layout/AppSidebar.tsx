import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import {
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
} from '../icons/CorporateIcons';

export function AppSidebar() {
  const { user, logout, switchUser } = useAuth();
  const navigate = useNavigate();

  // Para o perfil de RT Master: seletor de visão de curso
  const [rtCourseView, setRtCourseView] = useState<'psicologia' | 'odontologia' | 'global'>('global');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchUserAndNavigate = async (presetKey: string) => {
    await switchUser(presetKey);
    // Redirecionamento instantâneo para a tela nativa do perfil/curso selecionado
    if (presetKey === 'estagiario_psico') {
      navigate('/psi/prontuario');
    } else if (presetKey === 'supervisor_psico') {
      navigate('/psi/supervisao');
    } else if (presetKey === 'estagiario_odonto') {
      navigate('/ficha-odonto');
    } else if (presetKey === 'supervisor_odonto') {
      navigate('/supervisao');
    } else if (presetKey === 'recepcao') {
      navigate('/recepcao');
    } else if (presetKey === 'rt_master') {
      navigate('/rt/relatorios');
    }
  };

  const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-slate-900 text-white shadow-xs'
        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
    }`;

  const isPsicoUser = user?.curso === 'psicologia' && user?.perfil !== 'rt' && user?.perfil !== 'recepcao';
  const isOdontoUser = user?.curso === 'odontologia' && user?.perfil !== 'rt' && user?.perfil !== 'recepcao';
  const isRecepcao = user?.perfil === 'recepcao';
  const isRT = user?.perfil === 'rt';

  return (
    <aside className="w-64 bg-slate-50/70 backdrop-blur-md border-r border-slate-200/80 flex flex-col h-screen fixed left-0 top-0 justify-between select-none z-30">
      <div>
        {/* Cabeçalho da Marca & Curso */}
        <div className="p-4 border-b border-slate-200/60 bg-white/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                isPsicoUser
                  ? 'bg-blue-700'
                  : isOdontoUser
                  ? 'bg-emerald-700'
                  : isRT
                  ? 'bg-indigo-700'
                  : 'bg-slate-800'
              }`}
            >
              {isPsicoUser ? 'SPA' : isOdontoUser ? 'ODO' : isRT ? 'RT' : 'REC'}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate">
                {isPsicoUser
                  ? 'UniCare Psicologia'
                  : isOdontoUser
                  ? 'UniCare Odonto'
                  : isRT
                  ? 'UniCare Controladoria'
                  : 'UniCare Recepção'}
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 truncate">
                UNINASSAU Saúde
              </p>
            </div>
          </div>

          {/* Sub-badge normativo específico do curso */}
          <div className="mt-2.5">
            {isPsicoUser && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                Resolução CFP nº 06/2019
              </span>
            )}
            {isOdontoUser && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                Supervisão Clínica CFO
              </span>
            )}
            {isRecepcao && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                Acolhimento & Triagem Geral
              </span>
            )}
            {isRT && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                Gestão Geral Hospitalar (RT)
              </span>
            )}
          </div>
        </div>

        {/* MÓDULO EXCLUSIVO DA RT MASTER: Seletor de Visão */}
        {isRT && (
          <div className="px-3 pt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Alternar Módulo Clínico:
            </p>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/60 rounded-xl text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setRtCourseView('global')}
                className={`py-1 rounded-lg transition-all ${
                  rtCourseView === 'global' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Global
              </button>
              <button
                type="button"
                onClick={() => setRtCourseView('psicologia')}
                className={`py-1 rounded-lg transition-all ${
                  rtCourseView === 'psicologia' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Psico
              </button>
              <button
                type="button"
                onClick={() => setRtCourseView('odontologia')}
                className={`py-1 rounded-lg transition-all ${
                  rtCourseView === 'odontologia' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Odonto
              </button>
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO ESTRITA POR CURSO */}
        <nav className="px-3 py-3 space-y-4">
          {/* 1. SE O USUÁRIO FOR DE PSICOLOGIA (OU RT NA VISÃO PSICO/GLOBAL) */}
          {(isPsicoUser || (isRT && (rtCourseView === 'psicologia' || rtCourseView === 'global'))) && (
            <div>
              <h2 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Serviço de Psicologia (SPA)
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/psi/prontuario" className={getLinkStyle}>
                    <DocumentTextIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Prontuário Psicológico</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/psi/recepcao" className={getLinkStyle}>
                    <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Agenda & Triagem SPA</span>
                  </NavLink>
                </li>
                {(user?.perfil === 'supervisor' || isRT) && (
                  <li>
                    <NavLink to="/psi/supervisao" className={getLinkStyle}>
                      <ShieldCheckIcon className="w-4 h-4 shrink-0 text-slate-500" />
                      <span>Supervisão Docente SPA</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* 2. SE O USUÁRIO FOR DE ODONTOLOGIA (OU RT NA VISÃO ODONTO/GLOBAL) */}
          {(isOdontoUser || (isRT && (rtCourseView === 'odontologia' || rtCourseView === 'global'))) && (
            <div>
              <h2 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Clínica Odontológica
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/ficha-odonto" className={getLinkStyle}>
                    <DocumentTextIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Ficha Clínica & Odontograma</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/recepcao" className={getLinkStyle}>
                    <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Recepção Odontológica</span>
                  </NavLink>
                </li>
                {(user?.perfil === 'supervisor' || isRT) && (
                  <li>
                    <NavLink to="/supervisao" className={getLinkStyle}>
                      <ShieldCheckIcon className="w-4 h-4 shrink-0 text-slate-500" />
                      <span>Supervisão Odontologia</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* 3. SE O USUÁRIO FOR DA RECEPÇÃO */}
          {isRecepcao && (
            <div>
              <h2 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Central de Recepção & Agendamento
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/recepcao" className={getLinkStyle}>
                    <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Recepção Odontologia</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/psi/recepcao" className={getLinkStyle}>
                    <CalendarIcon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>Recepção SPA (Psicologia)</span>
                  </NavLink>
                </li>
              </ul>
              <div className="mt-4 px-2 py-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-800">
                <p className="font-bold">Salvaguarda RN-001 Ativa:</p>
                <p className="text-[10px] mt-0.5 text-amber-700 leading-relaxed">
                  Acesso aos prontuários clínicos estritamente bloqueado. Apenas agendamento e logística permitidos.
                </p>
              </div>
            </div>
          )}

          {/* 4. SE FOR SUPERVISOR OU RT: LINK DE INDICADORES E CUSTÓDIA */}
          {(user?.perfil === 'supervisor' || isRT) && (
            <div className="pt-2 border-t border-slate-200/60">
              <h2 className="px-2 text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5" />
                <span>Controladoria & Gestão</span>
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

      {/* RODAPÉ DO SIDEBAR: Perfil do Usuário e Simulador Corporativo */}
      <div className="p-3 border-t border-slate-200/70 bg-white/80">
        <div className="flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate leading-snug">{user?.nome || 'Usuário'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate font-mono">
              {user?.perfil} • {user?.curso}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* Simulador de Perfil em Popover Elegante */}
            <div className="relative group">
              <button
                type="button"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/70"
                title="Alternar Perfil / Curso"
              >
                <UserGroupIcon className="w-3.5 h-3.5" />
              </button>

              <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-64 z-50 text-xs">
                <p className="font-bold text-slate-400 px-2 py-1 mb-1 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  Simular Perfil Corporativo:
                </p>

                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-blue-700 uppercase px-2 pt-1">Módulo Psicologia:</p>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('estagiario_psico')}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50/70 rounded-lg text-slate-800 text-[11px] font-medium"
                  >
                    Estudante (Rikelme - Psico)
                  </button>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('supervisor_psico')}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50/70 rounded-lg text-slate-800 text-[11px] font-medium"
                  >
                    Supervisor (Prof. Robert - Psico)
                  </button>

                  <p className="text-[9px] font-bold text-emerald-700 uppercase px-2 pt-2 border-t border-slate-100">
                    Módulo Odontologia:
                  </p>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('estagiario_odonto')}
                    className="w-full text-left px-2 py-1.5 hover:bg-emerald-50/70 rounded-lg text-slate-800 text-[11px] font-medium"
                  >
                    Estudante (Augusto - Odonto)
                  </button>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('supervisor_odonto')}
                    className="w-full text-left px-2 py-1.5 hover:bg-emerald-50/70 rounded-lg text-slate-800 text-[11px] font-medium"
                  >
                    Supervisora (Profa. Bianca - Odonto)
                  </button>

                  <p className="text-[9px] font-bold text-slate-500 uppercase px-2 pt-2 border-t border-slate-100">
                    Módulos Institucionais:
                  </p>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('recepcao')}
                    className="w-full text-left px-2 py-1.5 hover:bg-amber-50/70 rounded-lg text-amber-900 text-[11px] font-medium"
                  >
                    Recepção Geral
                  </button>
                  <button
                    onClick={() => handleSwitchUserAndNavigate('rt_master')}
                    className="w-full text-left px-2 py-1.5 hover:bg-indigo-50/70 rounded-lg text-indigo-900 text-[11px] font-bold"
                  >
                    Referência Técnica Master (Dra. Camila)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Encerrar Sessão"
            >
              <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
