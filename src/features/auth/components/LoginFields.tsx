import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, PRESET_USERS } from '../context/AuthContext';
import {
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '../../../components/icons/CorporateIcons';

export function LoginFields() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Menus de Login Separados (Aba 1: Perfis da Banca / Homologação; Aba 2: Credencial Direta)
  const [activeTab, setActiveTab] = useState<'perfis' | 'credenciais'>('perfis');

  // Estado do Menu 1 (Perfis de Avaliação da Banca)
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('estagiario_psico');
  const [profilePassword, setProfilePassword] = useState('unicare123');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Estado do Menu 2 (Credenciais Manuais)
  const [identifier, setIdentifier] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [showManualPassword, setShowManualPassword] = useState(false);
  const [manualError, setManualError] = useState('');
  const [isLoadingManual, setIsLoadingManual] = useState(false);

  // Mapeamento determinístico de rotas de destino por preset
  const getDestinationRoute = (presetKey: string) => {
    switch (presetKey) {
      case 'estagiario_psico':
        return '/psi/prontuario';
      case 'supervisor_psico':
        return '/psi/supervisao';
      case 'estagiario_odonto':
        return '/ficha-odonto';
      case 'supervisor_odonto':
        return '/supervisao';
      case 'recepcao':
        return '/recepcao';
      case 'rt_master':
        return '/rt/relatorios';
      default:
        return '/psi/prontuario';
    }
  };

  // Submit do Menu 1 (Acesso Direto por Perfil da Banca)
  const handleProfileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (profilePassword.trim() !== 'unicare123') {
      setProfileError('Senha institucional incorreta. A senha padrão do ambiente de avaliação é unicare123.');
      return;
    }

    setIsLoadingProfile(true);
    try {
      await login(selectedPresetKey);
      navigate(getDestinationRoute(selectedPresetKey));
    } catch {
      setProfileError('Erro ao inicializar sessão. Verifique se o servidor está ativo.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Submit do Menu 2 (Login Manual por Matrícula ou E-mail)
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    const ident = identifier.trim().toLowerCase();
    const pass = manualPassword.trim();

    if (!ident) {
      setManualError('Por favor, informe sua matrícula ou e-mail institucional.');
      return;
    }

    if (!pass) {
      setManualError('Por favor, informe sua senha de acesso.');
      return;
    }

    if (pass !== 'unicare123') {
      setManualError('Matrícula/E-mail ou senha incorretos. (Dica de avaliação: senha padrão é unicare123)');
      return;
    }

    // Resolução automática do perfil a partir da matrícula ou e-mail
    let resolvedKey: string | null = null;
    if (ident === '16032935' || ident.includes('rikelme')) {
      resolvedKey = 'estagiario_psico';
    } else if (ident === '16024402' || ident.includes('augusto')) {
      resolvedKey = 'estagiario_odonto';
    } else if (ident === 'doc-8821' || ident.includes('robert')) {
      resolvedKey = 'supervisor_psico';
    } else if (ident === 'doc-9122' || ident.includes('bianca')) {
      resolvedKey = 'supervisor_odonto';
    } else if (ident === 'rec-001' || ident === 'rec-2026-01' || ident.includes('recepcao')) {
      resolvedKey = 'recepcao';
    } else if (ident === 'rt-001' || ident.includes('camila') || ident.includes('rt')) {
      resolvedKey = 'rt_master';
    } else {
      setManualError('Credencial não localizada na base institucional da UNINASSAU.');
      return;
    }

    setIsLoadingManual(true);
    try {
      await login(resolvedKey);
      navigate(getDestinationRoute(resolvedKey));
    } catch {
      setManualError('Falha ao autenticar com o servidor institucional.');
    } finally {
      setIsLoadingManual(false);
    }
  };

  const currentPresetUser = PRESET_USERS[selectedPresetKey];

  return (
    <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto">
      <div>
        {/* Cabeçalho do Card */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#002B49] text-white text-[10px] font-bold tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></span>
              <span>UNINASSAU</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Portal Integrado de Clínicas-Escola
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Autenticação Corporativa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acesso auditado sob conformidade LGPD e resoluções dos conselhos CFP e CFO.
          </p>
        </div>

        {/* MENUS DE LOGIN SEPARADOS (ABAS) - ELIMINA O CONFLITO DE INPUTS */}
        <div className="flex border-b border-slate-200 mb-5 bg-slate-50/70 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('perfis');
              setProfileError('');
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'perfis'
                ? 'bg-white text-[#002B49] shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserGroupIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Perfis da Banca & Avaliação</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('credenciais');
              setManualError('');
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'credenciais'
                ? 'bg-white text-[#002B49] shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Credencial Direta</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MENU 1: ACESSO POR SELEÇÃO DE PERFIL DA BANCA (SEM CONFLITO DE FORMULÁRIO) */}
        {/* ========================================================================= */}
        {activeTab === 'perfis' && (
          <form onSubmit={handleProfileLogin} className="space-y-4">
            <p className="text-[11px] font-semibold text-slate-600">
              Selecione o perfil desejado para carregar o ambiente correspondente:
            </p>

            {/* Módulo 1: Psicologia Clínica (Azul Safira CFP) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-700 inline-block"></span>
                <span>Psicologia Clínica (CFP 06/2019 • Azul Safira)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('estagiario_psico');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'estagiario_psico'
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Rikelme Roma Santos</span>
                    {selectedPresetKey === 'estagiario_psico' && (
                      <CheckIcon className="w-3.5 h-3.5 text-blue-700" />
                    )}
                  </div>
                  <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Estudante · Psicoterapia</p>
                  <p className="text-[9px] text-slate-400 font-mono">Matrícula: 16032935</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('supervisor_psico');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'supervisor_psico'
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Prof. Dr. Robert Santos</span>
                    {selectedPresetKey === 'supervisor_psico' && (
                      <CheckIcon className="w-3.5 h-3.5 text-blue-700" />
                    )}
                  </div>
                  <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Supervisor (CRP 19/0844)</p>
                  <p className="text-[9px] text-slate-400 font-mono">Homologação de Vistos</p>
                </button>
              </div>
            </div>

            {/* Módulo 2: Odontologia Integrada (Granada CFO) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#881337] inline-block"></span>
                <span>Odontologia Integrada (CFO • Granada)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('estagiario_odonto');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'estagiario_odonto'
                      ? 'border-[#881337] bg-rose-50/80 shadow-xs ring-1 ring-[#881337]'
                      : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Augusto Cesar Farias</span>
                    {selectedPresetKey === 'estagiario_odonto' && (
                      <CheckIcon className="w-3.5 h-3.5 text-[#881337]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#881337] font-semibold mt-0.5">Estudante · Dupla Clínica</p>
                  <p className="text-[9px] text-slate-400 font-mono">Matrícula: 16024402</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('supervisor_odonto');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'supervisor_odonto'
                      ? 'border-[#881337] bg-rose-50/80 shadow-xs ring-1 ring-[#881337]'
                      : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Profa. Dra. Bianca Nubia</span>
                    {selectedPresetKey === 'supervisor_odonto' && (
                      <CheckIcon className="w-3.5 h-3.5 text-[#881337]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#881337] font-semibold mt-0.5">Supervisora (CRO 4512)</p>
                  <p className="text-[9px] text-slate-400 font-mono">Homologação de Cadeira</p>
                </button>
              </div>
            </div>

            {/* Módulo 3: Gestão UNINASSAU & RT Master */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD100] inline-block"></span>
                <span>Gestão Institucional & RT Master UNINASSAU</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('recepcao');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'recepcao'
                      ? 'border-[#B45309] bg-amber-50/80 shadow-xs ring-1 ring-[#B45309]'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Recepção Central</span>
                    {selectedPresetKey === 'recepcao' && (
                      <CheckIcon className="w-3.5 h-3.5 text-[#B45309]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#B45309] font-semibold mt-0.5">Acolhimento & Triagem</p>
                  <p className="text-[9px] text-slate-400 font-mono">Bloqueio RN-001</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPresetKey('rt_master');
                    setProfileError('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPresetKey === 'rt_master'
                      ? 'border-[#002B49] bg-indigo-50/80 shadow-xs ring-1 ring-[#002B49]'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#002B49]">Dra. Camila</span>
                    {selectedPresetKey === 'rt_master' && (
                      <CheckIcon className="w-3.5 h-3.5 text-[#002B49]" />
                    )}
                  </div>
                  <p className="text-[10px] text-indigo-800 font-bold mt-0.5">RT Master Institucional</p>
                  <p className="text-[9px] text-slate-400 font-mono">Custódia & Indicadores</p>
                </button>
              </div>
            </div>

            {/* Painel do Perfil Selecionado com Campo de Senha e Confirmação */}
            {currentPresetUser && (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center ${
                        currentPresetUser.curso === 'psicologia'
                          ? 'bg-blue-700'
                          : currentPresetUser.curso === 'odontologia'
                          ? 'bg-[#881337]'
                          : 'bg-[#002B49]'
                      }`}
                    >
                      {currentPresetUser.nome.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {currentPresetUser.nome}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentPresetUser.matricula} • {currentPresetUser.perfil.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Pronto para Entrar
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Senha Institucional de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type={showProfilePassword ? 'text' : 'password'}
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      placeholder="Senha de acesso"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showProfilePassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showProfilePassword ? (
                        <EyeSlashIcon className="w-3.5 h-3.5" />
                      ) : (
                        <EyeIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {profileError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                    <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{profileError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoadingProfile}
                  className="w-full bg-[#002B49] hover:bg-[#001D33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#001D33] disabled:opacity-50"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-[#FFD100]" />
                  <span>
                    {isLoadingProfile
                      ? 'Autenticando...'
                      : `Acessar como ${currentPresetUser.nome.split(' ')[0]} (${currentPresetUser.perfil})`}
                  </span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================================= */}
        {/* MENU 2: LOGIN MANUAL POR CREDENCIAIS (MATRÍCULA OU E-MAIL + SENHA)       */}
        {/* ========================================================================= */}
        {activeTab === 'credenciais' && (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <p className="text-[11px] font-semibold text-slate-600">
              Digite sua credencial acadêmica cadastrada na UNINASSAU:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula Institucional ou E-mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ex: 16032935, DOC-8821, RT-001 ou seu.email@uninassau.edu.br"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Senha de Acesso</label>
                <a href="/recuperar-senha" className="text-xs text-blue-700 hover:underline font-medium">
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  type={showManualPassword ? 'text' : 'password'}
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  placeholder="Informe sua senha"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowManualPassword(!showManualPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showManualPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showManualPassword ? (
                    <EyeSlashIcon className="w-3.5 h-3.5" />
                  ) : (
                    <EyeIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {manualError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                <span>{manualError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingManual}
              className="w-full bg-[#002B49] hover:bg-[#001D33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#001D33] disabled:opacity-50"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-[#FFD100]" />
              <span>{isLoadingManual ? 'Validando...' : 'Entrar no Sistema UNINASSAU'}</span>
            </button>

            {/* Dica de Avaliação */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-700" />
                <span>Credenciais de Homologação da Banca</span>
              </p>
              <p className="text-[10px] text-slate-500">
                A senha padrão de todos os perfis é <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">unicare123</code>.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Rodapé Interno com Aviso de Segurança */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>Campus Aracaju • Clínicas Integradas</span>
        <span className="font-mono">UniCare v2.0 • RBAC Ativo</span>
      </div>
    </div>
  );
}