import { useState } from 'react';
import { PsySidebar } from '../../components/PsySidebar';
import { useAuth } from '../../../auth/context/AuthContext';

export function PsyRecordPage() {
  const { user, logout, switchUser } = useAuth();

  // Campos estruturados de evolução (RNF-003: Início, Meio e Fim)
  const [evolucaoInicio, setEvolucaoInicio] = useState(
    'Acolhimento pontual e receptivo. Paciente relata manutenção do quadro de sobrecarga em período de provas acadêmicas.'
  );
  const [evolucaoMeio, setEvolucaoMeio] = useState(
    'Aplicação da técnica de reestruturação cognitiva sobre pensamentos automáticos de autoexigência. Paciente externalizou estratégias prévias adaptativas com boa adesão às reflexões.'
  );
  const [evolucaoFim, setEvolucaoFim] = useState(
    'Fechamento com pactuação de registro de pensamentos disfuncionais (RPD) até a próxima sessão. Sem indicadores de risco.'
  );

  const [demandaGeral, setDemandaGeral] = useState(
    'Atendimento psicoterápico focal em Terapia Cognitivo-Comportamental para manejo de ansiedade de desempenho e autorregulação acadêmica.'
  );

  const [statusSubmissao, setStatusSubmissao] = useState<'rascunho' | 'aguardando_validacao' | 'validado'>('rascunho');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    if (temViolacaoAspas) return;
    setStatusSubmissao('aguardando_validacao');
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-[#1e293b] flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Barra Superior com Status RBAC e Identificação de Usuário */}
        <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <span>🏢</span> Unidade Aracaju • Serviço de Psicologia Aplicada (SPA)
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>✔️</span> Resolução CFP nº 06/2019
            </span>

            {/* Informações do Usuário Logado */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right text-xs">
                <p className="font-bold text-gray-900">{user?.nome || 'Estagiário'}</p>
                <p className="text-gray-500 text-[10px]">
                  Matrícula: {user?.matricula} • Perfil: <span className="capitalize font-semibold text-blue-700">{user?.perfil}</span>
                </p>
              </div>

              {/* Botão de Alternar Perfil para Testes Rápidos */}
              <div className="relative group">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center font-bold text-xs hover:bg-blue-200"
                  title="Clique para alternar perfil de teste"
                >
                  👤
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-56 z-50 text-xs">
                  <p className="font-bold text-gray-700 px-2 py-1 mb-1 border-b">Simular Perfil RBAC:</p>
                  <button
                    onClick={() => switchUser('estagiario_psico')}
                    className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded text-gray-800"
                  >
                    Estudante (Rikelme - Psico)
                  </button>
                  <button
                    onClick={() => switchUser('supervisor_psico')}
                    className="w-full text-left px-2 py-1.5 hover:bg-indigo-50 rounded text-gray-800"
                  >
                    Supervisor (Prof. Robert)
                  </button>
                  <button
                    onClick={() => switchUser('recepcao')}
                    className="w-full text-left px-2 py-1.5 hover:bg-amber-50 rounded text-gray-800"
                  >
                    Recepção (Testar Bloqueio RN-01)
                  </button>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 rounded font-bold"
                  >
                    Sair do Sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Título do Documento */}
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                Manual Orientativo de Registro e Elaboração de Documentos Psicológicos (CFP)
              </p>
              <h1 className="text-2xl font-bold text-[#0a1526] mb-1">
                Prontuário Psicológico / Registro Documental
              </h1>
              <p className="text-sm text-gray-500">
                Serviço de Psicologia Aplicada (SPA) • Clínica-Escola UNINASSAU Aracaju
              </p>
            </div>

            {/* ALERTA NORMATIVO CFP EM TEMPO REAL (RN-002 / CA-03) */}
            {temViolacaoAspas && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-400 shadow-md animate-pulse">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                        Regra de Negócio RN-002 • Resolução CFP nº 06/2019
                      </span>
                      <span className="text-xs font-bold text-amber-800">
                        Transcrição Literal Detectada!
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 mt-1 font-medium leading-relaxed">
                      O prontuário psicológico não pode conter falas literais ou citações diretas do paciente entre aspas.
                      O registro deve ser estritamente técnico e sintético, elaborado pelo estagiário. O envio está bloqueado até a remoção das aspas.
                    </p>
                  </div>
                  <button
                    onClick={removerAspasAutomaticamente}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm shrink-0"
                  >
                    ✨ Sanitizar Aspas Agora
                  </button>
                </div>
              </div>
            )}

            {/* Feedback de Status Atual */}
            {statusSubmissao === 'aguardando_validacao' && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-blue-900">
                  <span className="text-lg">⏳</span>
                  <div>
                    <span className="font-bold">Status: Aguardando Validação Docente</span>
                    <p className="text-blue-700 text-[11px]">
                      Sessão submetida para homologação de visto do Prof. Dr. Robert Santos do Carmo (CRP 19/0844).
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-1 rounded uppercase">
                  Bloqueado para Edição
                </span>
              </div>
            )}

            {/* Corpo do Prontuário */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-24 space-y-8">
              {/* 1. Identificação */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    1. Identificação do Paciente
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Dados Criptografados (LGPD)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Nome Completo do Paciente
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Marcos Aurélio Silveira (M.A.S.)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="14/08/1998 (28 anos)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="***.482.915-**"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Avaliação de Demanda */}
              <section>
                <div className="flex justify-between items-end mb-3">
                  <h2 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    2. Avaliação de Demanda e Plano de Trabalho
                  </h2>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Registro Técnico Obrigatório
                  </span>
                </div>
                <textarea
                  value={demandaGeral}
                  onChange={(e) => setDemandaGeral(e.target.value)}
                  placeholder="Descreva a avaliação de demanda, hipótese diagnóstica e metas clínicas..."
                  className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </section>

              {/* 3. Evolução Estruturada (RNF-003: Início, Meio e Fim) */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      3. Evolução Estruturada da Sessão Atual (Início, Meio e Fim)
                    </h2>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Formulário guiado em conformidade com o Manual de Prontuário do Conselho Federal de Psicologia
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg border border-blue-100">
                    Sessão 04 • 15/09/2026 (Hoje)
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Bloco 1: Início */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      temAspasInicio
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          1
                        </span>
                        Início da Sessão (Acolhimento, Chegada e Revisão)
                      </label>
                      {temAspasInicio && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Contém aspas!
                        </span>
                      )}
                    </div>
                    <textarea
                      value={evolucaoInicio}
                      onChange={(e) => setEvolucaoInicio(e.target.value)}
                      placeholder="Descreva pontualidade, humor inicial relatado e revisão das tarefas anteriores sem aspas..."
                      rows={2}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none resize-none"
                    />
                  </div>

                  {/* Bloco 2: Meio */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      temAspasMeio
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          2
                        </span>
                        Meio da Sessão (Intervenções Técnicas e Manejo Psicológico)
                      </label>
                      {temAspasMeio && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Contém aspas!
                        </span>
                      )}
                    </div>
                    <textarea
                      value={evolucaoMeio}
                      onChange={(e) => setEvolucaoMeio(e.target.value)}
                      placeholder="Descreva as técnicas aplicadas, conceitualização e manejo sem citar diretamente falas do paciente..."
                      rows={3}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none resize-none"
                    />
                  </div>

                  {/* Bloco 3: Fim */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      temAspasFim
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          3
                        </span>
                        Fim da Sessão (Síntese, Tarefas Intersessão e Encaminhamentos)
                      </label>
                      {temAspasFim && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Contém aspas!
                        </span>
                      )}
                    </div>
                    <textarea
                      value={evolucaoFim}
                      onChange={(e) => setEvolucaoFim(e.target.value)}
                      placeholder="Descreva o fechamento da sessão, tarefas combinadas para a próxima semana e avaliação de risco..."
                      rows={2}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Botão de Teste para Demonstrar a Validação CA-03 para a Banca */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">
                  🧪 Teste de Homologação CA-03:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEvolucaoMeio(
                      'O paciente afirmou: "Sinto que não dou conta de entregar todos os trabalhos acadêmicos".'
                    )
                  }
                  className="text-xs text-amber-800 font-bold hover:underline"
                >
                  Inserir frase teste com aspas para disparar alerta CFP
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Fixo de Ações */}
        <footer className="bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-blue-600">🛡️</span>
            Documento sob sigilo institucional e conformidade ética estrita com o Conselho Federal de Psicologia.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert('Rascunho salvo localmente com sucesso.')}
              className="text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>💾</span> Salvar Rascunho
            </button>

            <button
              onClick={handleSalvarEnviar}
              disabled={temViolacaoAspas}
              title={
                temViolacaoAspas
                  ? 'Remova as aspas das anotações para habilitar o envio'
                  : 'Enviar evolução para revisão do supervisor'
              }
              className={`text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md ${
                temViolacaoAspas
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0a1526] hover:bg-black text-white'
              }`}
            >
              <span>➤</span> Salvar e Enviar para Supervisão
            </button>
          </div>
        </footer>
      </main>

      {/* Modal de Confirmação de Envio (Pós-condição UC-01) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 text-2xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Prontuário Enviado para Supervisão!
            </h3>
            <p className="text-xs text-gray-600 text-center mb-6 leading-relaxed">
              O registro estruturado em Início, Meio e Fim da Sessão 04 foi gravado com sucesso.
              O supervisor <strong className="text-gray-900">Prof. Dr. Robert Santos do Carmo (CRP 19/0844)</strong> foi notificado na Fila de Homologação.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg text-[11px] text-gray-500 mb-6 space-y-1">
              <p>• Status: <strong>AGUARDANDO_VALIDAÇÃO</strong></p>
              <p>• Rastreabilidade: <strong>Log de Auditoria gerado</strong></p>
              <p>• Integridade: <strong>Sem violações à Resolução CFP nº 06/2019</strong></p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#0a1526] hover:bg-black text-white py-2.5 rounded-lg text-xs font-bold transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}