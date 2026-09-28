import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '../../features/auth/context/AuthContext';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
} from '../icons/CorporateIcons';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeType?: 'blue' | 'emerald' | 'indigo' | 'amber' | 'slate';
  actions?: React.ReactNode;
}

export function AppLayout({
  children,
  title,
  subtitle,
  badge,
  badgeType = 'blue',
  actions,
}: AppLayoutProps) {
  const { user, logout, switchUser } = useAuth();
  const navigate = useNavigate();
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const isPsico = user?.curso === 'psicologia';
  const isOdonto = user?.curso === 'odontologia';
  const isRT = user?.perfil === 'rt';

  const handleSwitchUserAndNavigate = async (presetKey: string) => {
    setShowSwitchModal(false);
    await switchUser(presetKey);

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

  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'slate':
        return 'bg-slate-100 text-slate-800 border-slate-200/80';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar Corporativo com Segregação Estrita */}
      <AppSidebar />

      {/* Área Central de Trabalho */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Barra Superior Corporativa (Top Navigation Bar) */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs backdrop-blur-md">
          {/* Breadcrumb & Identificação Institucional */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BuildingOfficeIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Hospital-Escola UNINASSAU</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-600">
              {isPsico
                ? 'Serviço de Psicologia Aplicada'
                : isOdonto
                ? 'Clínica Odontológica Integrada'
                : isRT
                ? 'Diretoria Técnica & Compliance'
                : 'Central de Acolhimento'}
            </span>
            {badge && (
              <>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeStyle()}`}
                >
                  <ShieldCheckIcon className="w-3 h-3 mr-1 inline" />
                  {badge}
                </span>
              </>
            )}
          </div>

          {/* Área do Usuário Autenticado & Menu de Perfis */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[200px]">
                {user?.nome}
              </p>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                {user?.matricula ? `Matrícula: ${user.matricula} • ` : ''}
                <span className="uppercase font-semibold text-slate-700">
                  {user?.perfil}
                </span>
              </p>
            </div>

            {/* Avatar Inicial */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
                isPsico
                  ? 'bg-blue-700'
                  : isOdonto
                  ? 'bg-emerald-700'
                  : isRT
                  ? 'bg-indigo-700'
                  : 'bg-slate-800'
              }`}
            >
              {user?.nome?.charAt(0) || 'U'}
            </div>

            {/* Botão de Alternar Perfil */}
            <button
              type="button"
              onClick={() => setShowSwitchModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              title="Simular outro Perfil ou Curso"
            >
              <UserGroupIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Simular Perfil</span>
              <ChevronDownIcon className="w-3 h-3 text-slate-400" />
            </button>

            {/* Botão de Logout */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Encerrar Sessão"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Cabeçalho da Página (Page Header Card) */}
        <div className="bg-white border-b border-slate-200/70 px-6 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
                {badge && (
                  <span
                    className={`inline-flex sm:hidden items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeStyle()}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Modal Corporativo de Simulação de Perfis */}
      {showSwitchModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Simulador de Perfis & Segregação de Cursos
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Selecione o profissional para validar a interface e restrições de acesso (RBAC)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Grupo Psicologia */}
              <div>
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>Módulo Exclusivo de Psicologia Clínica (SPA)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('estagiario_psico')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.matricula === '16032935'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Rikelme Roma Santos</span>
                      {user?.matricula === '16032935' && <CheckIcon className="w-3.5 h-3.5 text-blue-700" />}
                    </div>
                    <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Estudante · Estágio em Psicoterapia</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Prontuário SPA • Resolução CFP 06/2019</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('supervisor_psico')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.matricula === 'DOC-PSI-01'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Prof. Dr. Robert Santos</span>
                      {user?.matricula === 'DOC-PSI-01' && <CheckIcon className="w-3.5 h-3.5 text-blue-700" />}
                    </div>
                    <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Supervisor Docente (CRP 19/0844)</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Fila de Homologação & Vistos</p>
                  </button>
                </div>
              </div>

              {/* Grupo Odontologia */}
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>Módulo Exclusivo de Odontologia Integrada</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('estagiario_odonto')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.matricula === '16032940'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Augusto Cesar Ribeiro</span>
                      {user?.matricula === '16032940' && <CheckIcon className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">Estudante · Dupla Clínica PDR-05</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Ficha Clínica & Odontograma 2D</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('supervisor_odonto')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.matricula === 'DOC-ODO-01'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Profa. Dra. Bianca Melo</span>
                      {user?.matricula === 'DOC-ODO-01' && <CheckIcon className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">Supervisora Clínica (CRO-SE 3120)</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Homologação de Cadeira CFO</p>
                  </button>
                </div>
              </div>

              {/* Grupo Institucional */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Módulos Institucionais & Controladoria
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('recepcao')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.perfil === 'recepcao'
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Recepção Central</span>
                      {user?.perfil === 'recepcao' && <CheckIcon className="w-3.5 h-3.5 text-amber-700" />}
                    </div>
                    <p className="text-[10px] text-amber-800 font-semibold mt-0.5">Acolhimento & Triagem</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Salvaguarda RN-001 Ativa</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserAndNavigate('rt_master')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      user?.perfil === 'rt'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950">Dra. Camila Vasconcelos</span>
                      {user?.perfil === 'rt' && <CheckIcon className="w-3.5 h-3.5 text-indigo-700" />}
                    </div>
                    <p className="text-[10px] text-indigo-700 font-bold mt-0.5">Responsável Técnica Master</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Custódia Legal 20 Anos & LGPD</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
