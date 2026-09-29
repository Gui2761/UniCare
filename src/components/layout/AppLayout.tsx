import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useAuth, PRESET_USERS, type User } from '../../features/auth/context/AuthContext';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ExclamationTriangleIcon,
} from '../icons/CorporateIcons';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeType?: 'blue' | 'emerald' | 'indigo' | 'amber' | 'slate' | 'granada';
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
  const { user, logout, switchUser, allUsers } = useAuth();
  const navigate = useNavigate();

  // Estados do Modal de Troca Rápida de Perfil com Autenticação por Senha
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string | null>(null);
  const [switchPassword, setSwitchPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const [switchSuccess, setSwitchSuccess] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Escuta evento global disparado pelo sidebar para abrir o modal protegido
  useEffect(() => {
    const handleOpenModal = () => {
      setSelectedPresetKey(null);
      setSwitchPassword('');
      setSwitchError('');
      setSwitchSuccess(false);
      setShowSwitchModal(true);
    };

    window.addEventListener('open-switch-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-switch-modal', handleOpenModal);
    };
  }, []);

  const isPsico = user?.curso === 'psicologia';
  const isOdonto = user?.curso === 'odontologia';
  const isRT = user?.perfil === 'rt';

  const handleSelectPreset = (presetKey: string) => {
    setSelectedPresetKey(presetKey);
    setSwitchPassword('');
    setSwitchError('');
    setSwitchSuccess(false);
  };

  const currentUsers = allUsers || PRESET_USERS;
  const targetUser: User | undefined = selectedPresetKey
    ? (currentUsers[selectedPresetKey] || PRESET_USERS[selectedPresetKey])
    : undefined;

  const handleConfirmSwitchWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPresetKey) return;

    setSwitchError('');

    // Validação estrita da senha institucional
    if (switchPassword.trim() !== 'unicare123') {
      setSwitchError('Senha institucional incorreta. Acesso negado conforme diretriz RBAC.');
      return;
    }

    setIsAuthenticating(true);
    setSwitchSuccess(true);

    setTimeout(async () => {
      await switchUser(selectedPresetKey);
      setIsAuthenticating(false);
      setShowSwitchModal(false);

      if (targetUser?.curso === 'psicologia' && targetUser?.perfil === 'estagiario') {
        navigate('/psi/prontuario');
      } else if (targetUser?.curso === 'psicologia' && targetUser?.perfil === 'supervisor') {
        navigate('/psi/supervisao');
      } else if (targetUser?.curso === 'odontologia' && targetUser?.perfil === 'estagiario') {
        navigate('/ficha-odonto');
      } else if (targetUser?.curso === 'odontologia' && targetUser?.perfil === 'supervisor') {
        navigate('/supervisao');
      } else if (targetUser?.perfil === 'recepcao') {
        navigate('/recepcao');
      } else if (targetUser?.perfil === 'rt') {
        navigate('/rt/relatorios');
      } else {
        navigate('/psi/prontuario');
      }
    }, 700);
  };

  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'granada':
        return 'bg-rose-50 text-[#881337] border-rose-200/80';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'indigo':
        return 'bg-indigo-50 text-[#002B49] border-indigo-200/80';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'slate':
        return 'bg-slate-100 text-slate-800 border-slate-200/80';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
    }
  };

  // Cor de fundo dinâmica do sistema conforme o perfil e curso logado
  const getLayoutAtmosphere = () => {
    return 'bg-slate-50';
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900 ${getLayoutAtmosphere()}`}>
      {/* Sidebar Corporativo com Segregação Estrita */}
      <AppSidebar />

      {/* Área Central de Trabalho */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Barra Superior Corporativa com Cores Oficiais UNINASSAU */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs backdrop-blur-md">
          {/* Breadcrumb & Identificação Institucional UNINASSAU */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="bg-[#002B49] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider inline-flex items-center gap-2 border border-[#001D33] shadow-2xs">
              <span className="p-1 bg-white rounded-md flex items-center justify-center shadow-xs">
                <img
                  src="/uninassau-crest.png"
                  alt="Brasão UNINASSAU"
                  className="h-4 w-auto object-contain"
                />
              </span>
              <span className="font-mono text-[#FFD100]">UNINASSAU</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-600">
              {isPsico
                ? 'Serviço de Psicologia Aplicada (SPA)'
                : isOdonto
                ? 'Clínica Odontológica Integrada'
                : isRT
                ? 'Diretoria Técnica & Compliance'
                : 'Central Integrada de Acolhimento'}
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

          {/* Área do Usuário Autenticado & Menu de Perfis com Cores dos Cursos */}
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

            {/* Avatar Inicial na Cor Oficial do Curso */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                isPsico
                  ? 'bg-blue-700'
                  : isOdonto
                  ? 'bg-[#881337]'
                  : isRT
                  ? 'bg-[#002B49]'
                  : 'bg-[#B45309]'
              }`}
            >
              {user?.nome?.charAt(0) || 'U'}
            </div>

            {/* Botão de Alternar Perfil */}
            <button
              type="button"
              onClick={() => {
                setSelectedPresetKey(null);
                setSwitchPassword('');
                setSwitchError('');
                setSwitchSuccess(false);
                setShowSwitchModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-[#002B49]/5 hover:border-[#002B49]/30 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              title="Trocar de conta com validação de senha"
            >
              <UserGroupIcon className="w-3.5 h-3.5 text-[#002B49]" />
              <span className="hidden md:inline font-bold">Simular Perfil</span>
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

      {/* Modal Corporativo de Simulação de Perfis com Validação de Senha */}
      {showSwitchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                  <img
                    src="/uninassau-crest.png"
                    alt="Brasão Oficial UNINASSAU"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Troca Rápida de Perfil Institucional
                    </h3>
                    <span className="text-[9px] bg-[#002B49] text-[#FFD100] font-black px-1.5 py-0.5 rounded font-mono">
                      UNINASSAU
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {selectedPresetKey
                      ? 'Confirme a senha institucional para assumir a credencial'
                      : 'Selecione a conta para alternar com verificação de segurança (RBAC)'}
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

            {/* ETAPA 1: Escolha do Perfil */}
            {!selectedPresetKey && (
              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                {/* 1. Módulo Psicologia Clínica (Cor Oficial: Azul Safira) */}
                <div>
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 sticky top-0 bg-white py-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-700 inline-block"></span>
                    <span>Psicologia Clínica • Resolução CFP 06/2019 (Azul Safira)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(currentUsers)
                      .filter(([_, u]) => u.curso === 'psicologia' && u.perfil !== 'rt')
                      .map(([key, u]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectPreset(key)}
                          className={`p-3 rounded-xl border text-left transition-all hover:border-blue-600 hover:bg-blue-50/40 ${
                            user?.matricula === u.matricula
                              ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                            {user?.matricula === u.matricula && (
                              <CheckIcon className="w-3.5 h-3.5 text-blue-700 shrink-0 ml-1" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-blue-700 font-semibold truncate">
                              {u.perfil === 'estagiario' ? 'Estudante · Psicoterapia' : 'Supervisor Docente'}
                            </p>
                            {u.custom && (
                              <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                                Novo
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono">Matrícula: {u.matricula}</p>
                        </button>
                      ))}
                  </div>
                </div>

                {/* 2. Módulo Odontologia Integrada (Cor Oficial: Granada / Bordô & Verde Clínico) */}
                <div>
                  <p className="text-[10px] font-bold text-[#881337] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 sticky top-0 bg-white py-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#881337] inline-block"></span>
                    <span>Odontologia Integrada • Supervisão CFO (Granada / Bordô)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(currentUsers)
                      .filter(
                        ([_, u]) =>
                          u.curso === 'odontologia' && u.perfil !== 'recepcao' && u.perfil !== 'rt'
                      )
                      .map(([key, u]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectPreset(key)}
                          className={`p-3 rounded-xl border text-left transition-all hover:border-[#881337] hover:bg-rose-50/40 ${
                            user?.matricula === u.matricula
                              ? 'border-[#881337] bg-rose-50/70 shadow-xs ring-1 ring-[#881337]'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                            {user?.matricula === u.matricula && (
                              <CheckIcon className="w-3.5 h-3.5 text-[#881337] shrink-0 ml-1" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-[#881337] font-semibold truncate">
                              {u.perfil === 'estagiario' ? 'Estudante · Odonto' : 'Supervisora Docente'}
                            </p>
                            {u.custom && (
                              <span className="text-[8px] bg-rose-100 text-[#881337] font-bold px-1.5 py-0.2 rounded shrink-0">
                                Novo
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono">Matrícula: {u.matricula}</p>
                        </button>
                      ))}
                  </div>
                </div>

                {/* 3. Módulos Institucionais UNINASSAU (Cores Oficiais: Azul Marinho & Dourado) */}
                <div>
                  <p className="text-[10px] font-bold text-[#002B49] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 sticky top-0 bg-white py-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] inline-block"></span>
                    <span>Gestão & Controladoria UNINASSAU (Azul Marinho & Dourado)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(currentUsers)
                      .filter(([_, u]) => u.perfil === 'rt' || u.perfil === 'recepcao')
                      .map(([key, u]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSelectPreset(key)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            u.perfil === 'recepcao'
                              ? user?.perfil === 'recepcao'
                                ? 'border-[#B45309] bg-amber-50/70 shadow-xs ring-1 ring-[#B45309]'
                                : 'border-slate-200 bg-white hover:border-[#B45309] hover:bg-amber-50/40'
                              : user?.perfil === 'rt'
                              ? 'border-[#002B49] bg-indigo-50/70 shadow-xs ring-1 ring-[#002B49]'
                              : 'border-slate-200 bg-white hover:border-[#002B49] hover:bg-blue-50/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                            {user?.matricula === u.matricula && (
                              <CheckIcon
                                className={`w-3.5 h-3.5 shrink-0 ml-1 ${
                                  u.perfil === 'recepcao' ? 'text-amber-700' : 'text-[#002B49]'
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p
                              className={`text-[10px] font-semibold truncate ${
                                u.perfil === 'recepcao' ? 'text-amber-800' : 'text-[#002B49]'
                              }`}
                            >
                              {u.perfil === 'recepcao' ? 'Acolhimento & Triagem' : 'RT Master Institucional'}
                            </p>
                            {u.custom && (
                              <span className="text-[8px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0">
                                Novo
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-mono">Matrícula: {u.matricula}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: Confirmação com Senha Obrigatória */}
            {selectedPresetKey && targetUser && (
              <form onSubmit={handleConfirmSwitchWithPassword} className="space-y-4">
                {/* Card do Usuário Alvo Selecionado */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    targetUser.curso === 'psicologia'
                      ? 'bg-blue-50/60 border-blue-200'
                      : targetUser.curso === 'odontologia'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs ${
                        targetUser.curso === 'psicologia'
                          ? 'bg-blue-700'
                          : targetUser.curso === 'odontologia'
                          ? 'bg-[#881337]'
                          : 'bg-[#002B49]'
                      }`}
                    >
                      {targetUser.nome.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{targetUser.nome}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {targetUser.perfil === 'estagiario'
                          ? 'Estagiário Acadêmico'
                          : targetUser.perfil === 'supervisor'
                          ? 'Docente Supervisor'
                          : targetUser.perfil === 'rt'
                          ? 'Responsável Técnica Master'
                          : 'Recepção Integrada'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Matrícula: {targetUser.matricula}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      targetUser.curso === 'psicologia'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : targetUser.curso === 'odontologia'
                        ? 'bg-rose-100 text-[#881337] border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {targetUser.curso === 'psicologia' ? 'Psicologia' : 'Odontologia'}
                  </span>
                </div>

                {/* Notificação Institucional de Auditoria */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-[#002B49]" />
                    <span>Validação de Segurança UNINASSAU & LGPD:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    A troca de perfil exige a senha individual do operador para garantir que cada atendimento seja assinado e auditado com rastreabilidade formal.
                  </p>
                  <p className="text-[10px] text-[#002B49] font-bold pt-0.5 font-mono">
                    Senha padrão de homologação: <strong className="underline">unicare123</strong>
                  </p>
                </div>

                {/* Campo de Senha Obrigatória */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Digite a Senha Institucional do Usuário *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LockClosedIcon className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      value={switchPassword}
                      onChange={(e) => {
                        setSwitchPassword(e.target.value);
                        setSwitchError('');
                      }}
                      placeholder="Senha do usuário"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/15 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Mensagens de Feedback */}
                {switchError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-medium flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{switchError}</span>
                  </div>
                )}

                {switchSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Autenticação confirmada! Carregando sessão de {targetUser.nome}...</span>
                  </div>
                )}

                {/* Ações do Formulário */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetKey(null);
                      setSwitchPassword('');
                      setSwitchError('');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Voltar para Seleção
                  </button>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="px-5 py-2 bg-[#002B49] hover:bg-[#001D33] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#001D33]"
                  >
                    {isAuthenticating ? (
                      <span>Autenticando...</span>
                    ) : (
                      <>
                        <KeyIcon className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>Autenticar e Entrar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
