import { useState } from 'react';
import { PsySidebar } from '../../components/PsySidebar';
import { useAuth } from '../../../auth/context/AuthContext';
import { useClinic } from '../../../clinic/context/ClinicContext';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '../../../../components/icons/CorporateIcons';

// Helper de relógio corporativo
function ClockOutlineIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export function PsyRecordPage() {
  const { user, switchUser } = useAuth();
  const { pacientes, evolucoesPsico, adicionarEvolucaoPsico } = useClinic();

  // Filtrar apenas pacientes com prontuário de psicologia ativo
  const pacientesPsico = pacientes.filter(
    (p) => p.curso === 'psicologia' || p.curso === 'ambos'
  );

  const [selectedPatientId, setSelectedPatientId] = useState<number>(
    pacientesPsico[0]?.id || 1
  );

  const pacienteSelecionado =
    pacientesPsico.find((p) => p.id === selectedPatientId) || pacientesPsico[0];

  const [activeTab, setActiveTab] = useState<'registro' | 'historico'>('registro');

  // Histórico de sessões do paciente atual (RF-008 & RN-005)
  const historicoSessoes = evolucoesPsico.filter(
    (e) => e.pacienteId === pacienteSelecionado?.id
  );

  // Campos estruturados de evolução (RNF-003: Início, Meio e Fim)
  const proximaSessaoNumero = `Sessão ${(historicoSessoes.length + 1).toString().padStart(2, '0')}`;
  const [numeroSessao, setNumeroSessao] = useState(proximaSessaoNumero);
  const [dataSessao, setDataSessao] = useState(new Date().toISOString().split('T')[0]);

  const [evolucaoInicio, setEvolucaoInicio] = useState(
    'Acolhimento pontual e receptivo. Paciente relata manutenção do quadro de sobrecarga em período de provas acadêmicas.'
  );
  const [evolucaoMeio, setEvolucaoMeio] = useState(
    'Aplicação da técnica de reestruturação cognitiva sobre pensamentos automáticos de autoexigência. Paciente externalizou estratégias prévias adaptativas com boa adesão às reflexões.'
  );
  const [evolucaoFim, setEvolucaoFim] = useState(
    'Fechamento com pactuação de registro de pensamentos disfuncionais (RPD) até a próxima sessão. Sem indicadores de risco autolesivo.'
  );


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');

  // Regex para detectar aspas duplas, simples ou tipográficas (RN-002 / CFP nº 06/2019)
  const quoteRegex = /["“”«»]/;

  const temAspasInicio = quoteRegex.test(evolucaoInicio);
  const temAspasMeio = quoteRegex.test(evolucaoMeio);
  const temAspasFim = quoteRegex.test(evolucaoFim);
  const temViolacaoAspas = temAspasInicio || temAspasMeio || temAspasFim;

  const removerAspasAutomaticamente = () => {
    setEvolucaoInicio((prev) => prev.replace(/["“”«»]/g, ''));
    setEvolucaoMeio((prev) => prev.replace(/["“”«»]/g, ''));
    setEvolucaoFim((prev) => prev.replace(/["“”«»]/g, ''));
  };

  const handleSalvarEnviar = () => {
    if (temViolacaoAspas || !pacienteSelecionado) return;

    const protocolo = `PRT-${Date.now().toString().slice(-6)}/${new Date().getFullYear()}`;
    setProtocoloGerado(protocolo);

    // Persistência real no ClinicContext e backend FastAPI
    adicionarEvolucaoPsico({
      pacienteId: pacienteSelecionado.id,
      pacienteNome: pacienteSelecionado.nome,
      estagiarioNome: user?.nome || 'Rikelme Roma Santos',
      estagiarioMatricula: user?.matricula || '16032935',
      supervisorNome: 'Prof. Dr. Robert Santos do Carmo',
      dataSessao: new Date(dataSessao).toLocaleDateString('pt-BR'),
      numeroSessao: numeroSessao,
      inicioTexto: evolucaoInicio,
      meioTexto: evolucaoMeio,
      fimTexto: evolucaoFim,
    });

    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden bg-slate-50">
        {/* Barra Superior Corporativa com Compliance e Switcher de Perfis */}
        <header className="bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hospital-Escola UNINASSAU
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-900">
              Serviço de Psicologia Aplicada (SPA)
            </span>
            <span className="text-slate-300">/</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              CFP Resolução 06/2019
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">{user?.nome || 'Estagiário'}</p>
              <p className="text-slate-500 text-[10px]">
                Matrícula: {user?.matricula} • Perfil:{' '}
                <span className="uppercase font-semibold text-blue-700">{user?.perfil}</span>
              </p>
            </div>

            {/* Alternador de Perfil para Demonstração Corporativa */}
            <div className="relative group">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 transition-colors"
                title="Alternar Perfil Institucional"
              >
                <UserGroupIcon className="w-4 h-4 text-slate-600" />
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-64 z-50 text-xs">
                <p className="font-bold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  Simular Acesso RBAC:
                </p>
                <button
                  onClick={() => switchUser('estagiario_psico')}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-slate-800 font-medium"
                >
                  Estagiário Psicologia (Rikelme)
                </button>
                <button
                  onClick={() => switchUser('supervisor_psico')}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-slate-800 font-medium"
                >
                  Supervisor Docente (Prof. Robert)
                </button>
                <button
                  onClick={() => switchUser('rt_master')}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-slate-800 font-medium"
                >
                  Referência Técnica (Dra. Camila)
                </button>
                <button
                  onClick={() => switchUser('recepcao')}
                  className="w-full text-left px-2 py-1.5 hover:bg-amber-50 rounded text-amber-800 font-medium"
                >
                  Recepção (Testar Bloqueio RN-001)
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Cabeçalho do Módulo Clínico */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Registro Documental & Prontuário Eletrônico
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-1">
                  Evolução Clínica de Psicoterapia Individual
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Em conformidade com a Resolução CFP nº 06/2019 e LGPD Artigo 11 (Dados Sensíveis)
                </p>
              </div>

              {/* Seletor Dinâmico de Pacientes (UC-01) */}
              <div className="w-full md:w-72">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Selecionar Paciente Ativo
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {pacientesPsico.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.cpf})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navegação por Abas: Registro vs Histórico (RF-008) */}
            <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl">
              <button
                onClick={() => setActiveTab('registro')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'registro'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Registrar Nova Sessão</span>
              </button>

              <button
                onClick={() => setActiveTab('historico')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'historico'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ClockOutlineIcon className="w-4 h-4" />
                <span>Histórico de Atendimentos Anteriores ({historicoSessoes.length})</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  RF-008
                </span>
              </button>
            </div>

            {/* ALERTA NORMATIVO ANTI-ASPAS (RN-002 / CFP nº 06/2019) */}
            {temViolacaoAspas && activeTab === 'registro' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-sm flex items-start gap-3.5">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                      Inconformidade Técnica • RN-002
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      Uso de Citações / Aspas Identificado
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    A Resolução CFP nº 06/2019 veda expressamente transcrições literais do discurso do paciente entre aspas.
                    O registro em prontuário deve ser exclusivamente uma síntese técnica e conceitual redigida pelo estagiário.
                  </p>
                </div>
                <button
                  onClick={removerAspasAutomaticamente}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 shadow-sm"
                >
                  Sanitizar Texto Automaticamente
                </button>
              </div>
            )}

            {activeTab === 'registro' ? (
              /* ABA 1: REGISTRO DA EVOLUÇÃO ATUAL */
              <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-8 space-y-8 shadow-sm">
                {/* 1. Identificação do Paciente Selecionado */}
                <section>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                      1. Identificação do Paciente
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Custódia LGPD Art. 11
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Nome do Paciente
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={pacienteSelecionado?.nome || ''}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Nascimento
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={pacienteSelecionado?.dataNascimento || ''}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        CPF Mascarado
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={pacienteSelecionado?.cpf || ''}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 outline-none font-mono"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Parâmetros da Sessão */}
                <section>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                      2. Dados da Sessão Clínica
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Ordem Cronológica (RF-008)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Identificador da Sessão
                      </label>
                      <input
                        type="text"
                        value={numeroSessao}
                        onChange={(e) => setNumeroSessao(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Data de Realização
                      </label>
                      <input
                        type="date"
                        value={dataSessao}
                        onChange={(e) => setDataSessao(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Docente Supervisor Vinculado
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Prof. Dr. Robert Santos do Carmo (CRP 19/0844)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 outline-none font-medium"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Evolução Estruturada Tripartite (RNF-003) */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                      3. Registro de Evolução Estruturada (Início, Meio e Fim)
                    </h2>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      RNF-003 • Síntese Técnica
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Fase 1: Início da Sessão (Acolhimento & Estado Geral)
                      </label>
                      {temAspasInicio && (
                        <span className="text-[10px] text-amber-700 font-bold">Aspas detectadas</span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={evolucaoInicio}
                      onChange={(e) => setEvolucaoInicio(e.target.value)}
                      placeholder="Descreva o acolhimento, pontualidade e relato inicial em termos técnicos..."
                      className={`w-full p-3 text-xs leading-relaxed rounded-lg border outline-none transition-colors ${
                        temAspasInicio
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Fase 2: Meio da Sessão (Intervenção Clínica & Aplicação de Técnicas)
                      </label>
                      {temAspasMeio && (
                        <span className="text-[10px] text-amber-700 font-bold">Aspas detectadas</span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={evolucaoMeio}
                      onChange={(e) => setEvolucaoMeio(e.target.value)}
                      placeholder="Descreva os procedimentos psicoterápicos, manejo técnico e respostas do paciente..."
                      className={`w-full p-3 text-xs leading-relaxed rounded-lg border outline-none transition-colors ${
                        temAspasMeio
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Fase 3: Fim da Sessão (Encaminhamentos & Tarefas Entre Sessões)
                      </label>
                      {temAspasFim && (
                        <span className="text-[10px] text-amber-700 font-bold">Aspas detectadas</span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={evolucaoFim}
                      onChange={(e) => setEvolucaoFim(e.target.value)}
                      placeholder="Descreva a pactuação final, tarefas acordadas e verificação de riscos..."
                      className={`w-full p-3 text-xs leading-relaxed rounded-lg border outline-none transition-colors ${
                        temAspasFim
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                  </div>
                </section>

                {/* Botões de Ação */}
                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEvolucaoInicio('');
                      setEvolucaoMeio('');
                      setEvolucaoFim('');
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Limpar Rascunho
                  </button>
                  <button
                    type="button"
                    disabled={temViolacaoAspas}
                    onClick={handleSalvarEnviar}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm ${
                      temViolacaoAspas
                        ? 'bg-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-blue-700 hover:bg-blue-800'
                    }`}
                  >
                    Submeter para Homologação Docente
                  </button>
                </div>
              </div>
            ) : (
              /* ABA 2: LINHA DO TEMPO / HISTÓRICO DE SESSÕES ANTERIORES (RF-008 & RN-005) */
              <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Linha do Tempo Cronológica de Atendimentos
                    </h2>
                    <p className="text-xs text-slate-500">
                      Paciente: <strong className="text-slate-800">{pacienteSelecionado?.nome}</strong> •{' '}
                      Prontuário Ativo
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {historicoSessoes.length} registros homologados/submetidos
                  </span>
                </div>

                {historicoSessoes.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <DocumentTextIcon className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs">Nenhum atendimento anterior registrado para este paciente.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {historicoSessoes.map((sessao, index) => (
                      <div
                        key={sessao.id || index}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-200/60">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-700 text-white font-mono">
                              {sessao.numeroSessao}
                            </span>
                            <span className="text-xs font-semibold text-slate-900">
                              Data: {sessao.dataSessao}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-xs text-slate-600">
                              Autor: <strong>{sessao.estagiarioNome}</strong> ({sessao.estagiarioMatricula})
                            </span>
                          </div>

                          <div>
                            {sessao.status === 'VALIDADO' ? (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                Homologado com Visto Digital
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                                <ClockOutlineIcon className="w-3.5 h-3.5" />
                                Aguardando Visto Docente
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Conteúdo da Síntese Tripartite */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Início da Sessão
                            </p>
                            <p className="text-slate-700 leading-relaxed">{sessao.inicioTexto}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Intervenção Técnica
                            </p>
                            <p className="text-slate-700 leading-relaxed">{sessao.meioTexto}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Encaminhamentos / Fechamento
                            </p>
                            <p className="text-slate-700 leading-relaxed">{sessao.fimTexto}</p>
                          </div>
                        </div>

                        {/* Parecer do Supervisor se houver */}
                        {sessao.parecerSupervisor && (
                          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs">
                            <p className="font-bold text-purple-900 mb-0.5 flex items-center gap-1">
                              <ShieldCheckIcon className="w-3.5 h-3.5" />
                              Parecer Pedagógico do Supervisor ({sessao.supervisorNome}):
                            </p>
                            <p className="text-purple-800 italic">{sessao.parecerSupervisor}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Corporativo de Confirmação e Protocolo */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Evolução Clínica Submetida com Sucesso
                </h3>
                <p className="text-xs text-slate-500">
                  O registro foi encaminhado para a fila de homologação e visto eletrônico do orientador docente.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 font-mono text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Protocolo de Registro</p>
                <p className="text-slate-900 font-bold">{protocoloGerado}</p>
                <p className="text-slate-400 text-[10px]">Autoria: {user?.nome} ({user?.matricula})</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('historico');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Visualizar na Linha do Tempo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}