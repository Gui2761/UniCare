import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, PRESET_USERS } from '../context/AuthContext';
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '../../../components/icons/CorporateIcons';
import type { ActiveDomain } from './LoginForm';

interface LoginFieldsProps {
  activeDomain: ActiveDomain;
  onDomainChange: (domain: ActiveDomain) => void;
}

export function LoginFields({ activeDomain, onDomainChange }: LoginFieldsProps) {
  const navigate = useNavigate();
  const { login, allUsers } = useAuth();
  const currentUsers = allUsers || PRESET_USERS;

  // Perfis selecionados dentro de cada menu de curso
  const [selectedPsicoProfile, setSelectedPsicoProfile] = useState<string>('estagiario_psico');
  const [selectedOdontoProfile, setSelectedOdontoProfile] = useState<string>('estagiario_odonto');
  const [selectedInstitucionalProfile, setSelectedInstitucionalProfile] = useState<string>('recepcao');

  // Senhas e estados de visibilidade
  const [password, setPassword] = useState('unicare123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados da aba de Credencial Direta
  const [identifier, setIdentifier] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [showManualPassword, setShowManualPassword] = useState(false);

  // Limpa erro ao mudar de menu
  useEffect(() => {
    setErrorMsg('');
  }, [activeDomain]);

  // Roteamento determinístico por chave de usuário (suporta presets e perfis dinâmicos)
  const getDestinationRoute = (presetKey: string) => {
    const target = currentUsers[presetKey] || PRESET_USERS[presetKey];
    if (!target) return '/psi/prontuario';

    if (target.curso === 'psicologia') {
      return target.perfil === 'supervisor' ? '/psi/supervisao' : '/psi/prontuario';
    }
    if (target.curso === 'odontologia') {
      if (target.perfil === 'recepcao') return '/recepcao';
      return target.perfil === 'supervisor' ? '/supervisao' : '/ficha-odonto';
    }
    if (target.perfil === 'recepcao') return '/recepcao';
    if (target.perfil === 'rt') return '/rt/relatorios';
    return '/psi/prontuario';
  };

  // Submit dos Menus por Curso (Psicologia, Odontologia, Gestão)
  const handleDomainLogin = async (e: React.FormEvent, presetKey: string) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Por favor, informe a senha institucional para autenticar este perfil.');
      return;
    }

    if (password.trim() !== 'unicare123') {
      setErrorMsg('Senha institucional incorreta. A senha padrão de homologação é unicare123.');
      return;
    }

    setIsLoading(true);
    try {
      await login(presetKey);
      navigate(getDestinationRoute(presetKey));
    } catch {
      setErrorMsg('Erro ao conectar ao servidor de autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit da Aba de Credencial Direta
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const ident = identifier.trim().toLowerCase();
    const pass = manualPassword.trim();

    if (!ident) {
      setErrorMsg('Por favor, informe sua matrícula ou e-mail institucional.');
      return;
    }

    if (!pass) {
      setErrorMsg('Por favor, informe sua senha de acesso.');
      return;
    }

    if (pass !== 'unicare123') {
      setErrorMsg('Matrícula/E-mail ou senha incorretos. (Dica de homologação: unicare123)');
      return;
    }

    // Busca dinâmica em toda a base de usuários (presets + criados)
    let resolvedKey: string | null = null;
    for (const [key, u] of Object.entries(currentUsers)) {
      if (
        u.matricula.toLowerCase() === ident ||
        u.email.toLowerCase() === ident ||
        u.nome.toLowerCase().includes(ident)
      ) {
        resolvedKey = key;
        if (u.curso === 'psicologia') onDomainChange('psicologia');
        else if (u.curso === 'odontologia' && u.perfil !== 'recepcao') onDomainChange('odontologia');
        else onDomainChange('institucional');
        break;
      }
    }

    // Fallbacks para identificadores parciais
    if (!resolvedKey) {
      if (ident === '16032935' || ident.includes('rikelme')) {
        resolvedKey = 'estagiario_psico';
        onDomainChange('psicologia');
      } else if (ident === '16024402' || ident.includes('augusto')) {
        resolvedKey = 'estagiario_odonto';
        onDomainChange('odontologia');
      } else if (ident === 'doc-8821' || ident.includes('robert')) {
        resolvedKey = 'supervisor_psico';
        onDomainChange('psicologia');
      } else if (ident === 'doc-9122' || ident.includes('bianca')) {
        resolvedKey = 'supervisor_odonto';
        onDomainChange('odontologia');
      } else if (ident === 'rec-001' || ident === 'rec-2026-01' || ident.includes('recepcao')) {
        resolvedKey = 'recepcao';
        onDomainChange('institucional');
      } else if (ident === 'rt-001' || ident.includes('camila') || ident.includes('rt')) {
        resolvedKey = 'rt_master';
        onDomainChange('institucional');
      }
    }

    if (!resolvedKey) {
      setErrorMsg('Credencial não localizada na base institucional da UNINASSAU.');
      return;
    }

    setIsLoading(true);
    try {
      await login(resolvedKey);
      navigate(getDestinationRoute(resolvedKey));
    } catch {
      setErrorMsg('Falha ao autenticar com o servidor institucional.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reação dinâmica na digitação da credencial manual
  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);
    const low = val.toLowerCase();
    if (low.includes('16032935') || low.includes('rikelme') || low.includes('8821') || low.includes('robert')) {
      onDomainChange('psicologia');
    } else if (low.includes('16024402') || low.includes('augusto') || low.includes('9122') || low.includes('bianca')) {
      onDomainChange('odontologia');
    } else if (low.includes('rec') || low.includes('rt') || low.includes('camila')) {
      onDomainChange('institucional');
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto">
      <div>
        {/* Cabeçalho do Card */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#002B49] text-white text-[10px] font-bold tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></span>
              <span>UNINASSAU</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Portal Integrado • Clínicas-Escola
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Autenticação Corporativa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecione o módulo de atuação para ativar a atmosfera e as credenciais correspondentes.
          </p>
        </div>

        {/* MENUS SEPARADOS POR CURSO / PERFIL (ABAS DEDICADAS) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onDomainChange('psicologia')}
            className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
              activeDomain === 'psicologia'
                ? 'bg-blue-700 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <span>Psicologia</span>
            <span className={`text-[8px] uppercase tracking-wider ${activeDomain === 'psicologia' ? 'text-blue-200' : 'text-slate-400'}`}>CFP</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainChange('odontologia')}
            className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
              activeDomain === 'odontologia'
                ? 'bg-[#881337] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-[#881337] hover:bg-white/60'
            }`}
          >
            <span>Odontologia</span>
            <span className={`text-[8px] uppercase tracking-wider ${activeDomain === 'odontologia' ? 'text-rose-200' : 'text-slate-400'}`}>CFO</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainChange('institucional')}
            className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
              activeDomain === 'institucional'
                ? 'bg-[#002B49] text-[#FFD100] shadow-xs font-black'
                : 'text-slate-600 hover:text-[#002B49] hover:bg-white/60'
            }`}
          >
            <span>Gestão / RT</span>
            <span className={`text-[8px] uppercase tracking-wider ${activeDomain === 'institucional' ? 'text-amber-200' : 'text-slate-400'}`}>Veritas</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainChange('credenciais')}
            className={`py-2 px-1 rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
              activeDomain === 'credenciais'
                ? 'bg-slate-900 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Credencial</span>
            <span className={`text-[8px] uppercase tracking-wider ${activeDomain === 'credenciais' ? 'text-slate-300' : 'text-slate-400'}`}>Direta</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MENU 1: CURSO DE PSICOLOGIA CLÍNICA (AZUL SAFIRA CFP)                    */}
        {/* ========================================================================= */}
        {activeDomain === 'psicologia' && (
          <form onSubmit={(e) => handleDomainLogin(e, selectedPsicoProfile)} className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                <span>Selecione a Credencial de Psicologia:</span>
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                Resolução CFP 06/2019
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {Object.entries(currentUsers)
                .filter(([_, u]) => u.curso === 'psicologia' && u.perfil !== 'rt')
                .map(([key, u]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPsicoProfile(key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedPsicoProfile === key
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-600/30'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                      {selectedPsicoProfile === key && (
                        <CheckIcon className="w-4 h-4 text-blue-700 shrink-0 ml-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-blue-700 font-semibold truncate">
                        {u.perfil === 'estagiario' ? 'Estudante · Psicoterapia' : 'Supervisor de Estágio'}
                      </p>
                      {u.custom && (
                        <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                          Novo Perfil
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {u.matricula ? `Matrícula: ${u.matricula}` : ''}
                      {u.registro_profissional ? ` • ${u.registro_profissional}` : ''}
                    </p>
                    <div className="mt-2 text-[9px] text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded font-medium inline-block truncate max-w-full">
                      {u.perfil === 'estagiario' ? 'Prontuário SPA & Evolução' : 'Homologação & Vistos Digitais'}
                    </div>
                  </button>
                ))}
            </div>

            {/* Senha Obrigatória e Confirmação de Entrada */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso (Obrigatória)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha institucional"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-blue-900 disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-blue-200" />
                <span>
                  {isLoading
                    ? 'Autenticando no SPA...'
                    : `Acessar como ${
                        (currentUsers[selectedPsicoProfile] || PRESET_USERS.estagiario_psico).nome.split(' ')[0]
                      } (${
                        (currentUsers[selectedPsicoProfile] || PRESET_USERS.estagiario_psico).perfil === 'estagiario'
                          ? 'Estudante'
                          : 'Supervisor'
                      })`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MENU 2: CURSO DE ODONTOLOGIA INTEGRADA (GRANADA CFO)                     */}
        {/* ========================================================================= */}
        {activeDomain === 'odontologia' && (
          <form onSubmit={(e) => handleDomainLogin(e, selectedOdontoProfile)} className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#881337] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#881337]"></span>
                <span>Selecione a Credencial de Odontologia:</span>
              </span>
              <span className="text-[10px] bg-rose-50 text-[#881337] px-2 py-0.5 rounded font-bold border border-rose-200">
                Diretrizes CFO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {Object.entries(currentUsers)
                .filter(
                  ([_, u]) =>
                    u.curso === 'odontologia' && u.perfil !== 'recepcao' && u.perfil !== 'rt'
                )
                .map(([key, u]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedOdontoProfile(key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedOdontoProfile === key
                        ? 'border-[#881337] bg-rose-50/80 shadow-xs ring-2 ring-[#881337]/30'
                        : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                      {selectedOdontoProfile === key && (
                        <CheckIcon className="w-4 h-4 text-[#881337] shrink-0 ml-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-[#881337] font-semibold truncate">
                        {u.perfil === 'estagiario' ? 'Estudante · Dupla Clínica' : 'Supervisora Docente'}
                      </p>
                      {u.custom && (
                        <span className="text-[8px] bg-rose-100 text-[#881337] font-bold px-1.5 py-0.2 rounded shrink-0">
                          Novo Perfil
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {u.matricula ? `Matrícula: ${u.matricula}` : ''}
                      {u.registro_profissional ? ` • ${u.registro_profissional}` : ''}
                    </p>
                    <div className="mt-2 text-[9px] text-[#881337] bg-rose-100/70 px-2 py-0.5 rounded font-medium inline-block truncate max-w-full">
                      {u.perfil === 'estagiario' ? 'Odontograma 2D & Periodonto' : 'Homologação em Cadeira'}
                    </div>
                  </button>
                ))}
            </div>

            {/* Senha Obrigatória e Confirmação de Entrada */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso (Obrigatória)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha institucional"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/10 outline-none transition-all font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#881337] hover:bg-[#6e0f2c] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#4c0519] disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-rose-200" />
                <span>
                  {isLoading
                    ? 'Autenticando na Odontologia...'
                    : `Acessar como ${
                        (currentUsers[selectedOdontoProfile] || PRESET_USERS.estagiario_odonto).nome.split(' ')[0]
                      } (${
                        (currentUsers[selectedOdontoProfile] || PRESET_USERS.estagiario_odonto).perfil === 'estagiario'
                          ? 'Estudante'
                          : 'Supervisora'
                      })`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MENU 3: GESTÃO INSTITUCIONAL & RT MASTER (UNINASSAU VERITAS)             */}
        {/* ========================================================================= */}
        {activeDomain === 'institucional' && (
          <form onSubmit={(e) => handleDomainLogin(e, selectedInstitucionalProfile)} className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002B49] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD100]"></span>
                <span>Selecione a Credencial de Gestão:</span>
              </span>
              <span className="text-[10px] bg-amber-50 text-[#B45309] px-2 py-0.5 rounded font-bold border border-amber-200">
                UNINASSAU Veritas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {Object.entries(currentUsers)
                .filter(([_, u]) => u.perfil === 'rt' || u.perfil === 'recepcao')
                .map(([key, u]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedInstitucionalProfile(key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedInstitucionalProfile === key
                        ? u.perfil === 'recepcao'
                          ? 'border-[#B45309] bg-amber-50/80 shadow-xs ring-2 ring-[#B45309]/30'
                          : 'border-[#002B49] bg-indigo-50/80 shadow-xs ring-2 ring-[#002B49]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{u.nome}</span>
                      {selectedInstitucionalProfile === key && (
                        <CheckIcon
                          className={`w-4 h-4 shrink-0 ml-1 ${
                            u.perfil === 'recepcao' ? 'text-[#B45309]' : 'text-[#002B49]'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-[11px] font-semibold truncate ${
                          u.perfil === 'recepcao' ? 'text-[#B45309]' : 'text-indigo-800 font-bold'
                        }`}
                      >
                        {u.perfil === 'recepcao' ? 'Central de Acolhimento' : 'RT Master Institucional'}
                      </p>
                      {u.custom && (
                        <span className="text-[8px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0">
                          Novo Perfil
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Matrícula: {u.matricula}</p>
                    <div
                      className={`mt-2 text-[9px] px-2 py-0.5 rounded font-medium inline-block truncate max-w-full ${
                        u.perfil === 'recepcao'
                          ? 'text-amber-900 bg-amber-100/70'
                          : 'text-indigo-900 bg-indigo-100/70'
                      }`}
                    >
                      {u.perfil === 'recepcao' ? 'Triagem & Bloqueio RN-001' : 'Custódia 20 Anos & Auditoria'}
                    </div>
                  </button>
                ))}
            </div>

            {/* Senha Obrigatória e Confirmação de Entrada */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso (Obrigatória)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha institucional"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#002B49] hover:bg-[#001D33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#001D33] disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-[#FFD100]" />
                <span>
                  {isLoading
                    ? 'Autenticando...'
                    : `Acessar como ${
                        (currentUsers[selectedInstitucionalProfile] || PRESET_USERS.recepcao).nome.split(' ')[0]
                      } (${
                        (currentUsers[selectedInstitucionalProfile] || PRESET_USERS.recepcao).perfil === 'recepcao'
                          ? 'Recepção'
                          : 'RT Master'
                      })`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MENU 4: CREDENCIAL DIRETA (MATRÍCULA OU E-MAIL)                          */}
        {/* ========================================================================= */}
        {activeDomain === 'credenciais' && (
          <form onSubmit={handleManualLogin} className="space-y-4 animate-fadeIn">
            <p className="text-[11px] font-semibold text-slate-600">
              Digite sua credencial acadêmica para identificação automática:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula Institucional ou E-mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(e.target.value)}
                  placeholder="Ex: 16032935, 16024402, DOC-8821, DOC-9122, REC-2026-01 ou RT-001"
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
                >
                  {showManualPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#002B49] hover:bg-[#001D33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#001D33] disabled:opacity-50"
            >
              <KeyIcon className="w-4 h-4 text-[#FFD100]" />
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Sistema UNINASSAU'}</span>
            </button>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-700" />
                <span>Dica de Homologação</span>
              </p>
              <p className="text-[10px] text-slate-500">
                A senha padrão de todos os perfis é <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">unicare123</code>.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Rodapé Interno */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>Campus Aracaju • Clínicas Integradas</span>
        <span className="font-mono">UniCare v2.0 • Atmosfera Reativa</span>
      </div>
    </div>
  );
}