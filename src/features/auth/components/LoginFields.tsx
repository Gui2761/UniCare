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
  const { login } = useAuth();

  // Perfis selecionados dentro de cada menu de curso
  const [selectedPsicoProfile, setSelectedPsicoProfile] = useState<'estagiario_psico' | 'supervisor_psico'>('estagiario_psico');
  const [selectedOdontoProfile, setSelectedOdontoProfile] = useState<'estagiario_odonto' | 'supervisor_odonto'>('estagiario_odonto');
  const [selectedInstitucionalProfile, setSelectedInstitucionalProfile] = useState<'recepcao' | 'rt_master'>('recepcao');

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

  // Roteamento determinístico por chave de usuário
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

  // Submit dos Menus por Curso (Psicologia, Odontologia, Gestão)
  const handleDomainLogin = async (e: React.FormEvent, presetKey: string) => {
    e.preventDefault();
    setErrorMsg('');

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

    let resolvedKey: string | null = null;
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
    } else {
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPsicoProfile('estagiario_psico')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedPsicoProfile === 'estagiario_psico'
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Rikelme Roma Santos</span>
                  {selectedPsicoProfile === 'estagiario_psico' && (
                    <CheckIcon className="w-4 h-4 text-blue-700 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-blue-700 font-semibold">Estudante · Psicoterapia</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Matrícula: 16032935</p>
                <div className="mt-2 text-[9px] text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Prontuário SPA & Evolução
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPsicoProfile('supervisor_psico')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedPsicoProfile === 'supervisor_psico'
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Prof. Dr. Robert Santos</span>
                  {selectedPsicoProfile === 'supervisor_psico' && (
                    <CheckIcon className="w-4 h-4 text-blue-700 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-blue-700 font-semibold">Supervisor de Estágio</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Registro: CRP 19/0844</p>
                <div className="mt-2 text-[9px] text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Homologação & Vistos Digitais
                </div>
              </button>
            </div>

            {/* Senha e Confirmação */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    : `Acessar como ${PRESET_USERS[selectedPsicoProfile].nome.split(' ')[0]} (${selectedPsicoProfile === 'estagiario_psico' ? 'Estudante' : 'Supervisor'})`}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedOdontoProfile('estagiario_odonto')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedOdontoProfile === 'estagiario_odonto'
                    ? 'border-[#881337] bg-rose-50/80 shadow-xs ring-2 ring-[#881337]/30'
                    : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Augusto Cesar Farias</span>
                  {selectedOdontoProfile === 'estagiario_odonto' && (
                    <CheckIcon className="w-4 h-4 text-[#881337] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#881337] font-semibold">Estudante · Dupla Clínica</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Matrícula: 16024402</p>
                <div className="mt-2 text-[9px] text-[#881337] bg-rose-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Odontograma 2D & Periodonto
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOdontoProfile('supervisor_odonto')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedOdontoProfile === 'supervisor_odonto'
                    ? 'border-[#881337] bg-rose-50/80 shadow-xs ring-2 ring-[#881337]/30'
                    : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Profa. Dra. Bianca Nubia</span>
                  {selectedOdontoProfile === 'supervisor_odonto' && (
                    <CheckIcon className="w-4 h-4 text-[#881337] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#881337] font-semibold">Supervisora Docente</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Registro: CRO-SE 4512</p>
                <div className="mt-2 text-[9px] text-[#881337] bg-rose-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Homologação em Cadeira
                </div>
              </button>
            </div>

            {/* Senha e Confirmação */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    : `Acessar como ${PRESET_USERS[selectedOdontoProfile].nome.split(' ')[0]} (${selectedOdontoProfile === 'estagiario_odonto' ? 'Estudante' : 'Supervisora'})`}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedInstitucionalProfile('recepcao')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedInstitucionalProfile === 'recepcao'
                    ? 'border-[#B45309] bg-amber-50/80 shadow-xs ring-2 ring-[#B45309]/30'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Recepção Geral</span>
                  {selectedInstitucionalProfile === 'recepcao' && (
                    <CheckIcon className="w-4 h-4 text-[#B45309] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#B45309] font-semibold">Central de Acolhimento</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Matrícula: REC-2026-01</p>
                <div className="mt-2 text-[9px] text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Triagem & Bloqueio RN-001
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInstitucionalProfile('rt_master')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedInstitucionalProfile === 'rt_master'
                    ? 'border-[#002B49] bg-indigo-50/80 shadow-xs ring-2 ring-[#002B49]/30'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Dra. Camila</span>
                  {selectedInstitucionalProfile === 'rt_master' && (
                    <CheckIcon className="w-4 h-4 text-[#002B49] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-indigo-800 font-bold">RT Master Institucional</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Matrícula: RT-001</p>
                <div className="mt-2 text-[9px] text-indigo-900 bg-indigo-100/70 px-2 py-0.5 rounded font-medium inline-block">
                  Custódia 20 Anos & Auditoria
                </div>
              </button>
            </div>

            {/* Senha e Confirmação */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Senha Institucional de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    : `Acessar como ${PRESET_USERS[selectedInstitucionalProfile].nome.split(' ')[0]} (${selectedInstitucionalProfile === 'recepcao' ? 'Recepção' : 'RT Master'})`}
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