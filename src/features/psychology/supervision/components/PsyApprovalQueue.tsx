import { useState } from 'react';
import { useClinic } from '../../../clinic/context/ClinicContext';
import type { EvolucaoPsico } from '../../../clinic/context/ClinicContext';

export function PsyApprovalQueue() {
  const { evolucoesPsico, homologarEvolucaoPsico } = useClinic();

  const [selecionado, setSelecionado] = useState<EvolucaoPsico | null>(
    evolucoesPsico.find((e) => e.status === 'AGUARDANDO_VALIDACAO') || evolucoesPsico[0] || null
  );

  const [parecer, setParecer] = useState(
    'Evolução estruturada com rigor técnico. Ausência de citações literais e adequada aplicação do questionamento socrático em TCC. Visto concedido.'
  );
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const pendentes = evolucoesPsico.filter((e) => e.status === 'AGUARDANDO_VALIDACAO');
  const historico = evolucoesPsico.filter((e) => e.status !== 'AGUARDANDO_VALIDACAO');

  const handleAprovar = () => {
    if (!selecionado) return;
    homologarEvolucaoPsico(selecionado.id, 'VALIDADO', parecer);
    setFeedbackMsg(`Evolução do paciente ${selecionado.pacienteNome} APROVADA com Visto Eletrônico!`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDevolver = () => {
    if (!selecionado) return;
    homologarEvolucaoPsico(selecionado.id, 'DEVOLVIDO_PARA_AJUSTE', parecer);
    setFeedbackMsg(`Evolução DEVOLVIDA para ajuste do estagiário ${selecionado.estagiarioNome}.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm flex items-center justify-between">
          <span>✓ {feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Grid Principal: Fila à Esquerda + Devolutiva Pedagógica à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Fila de Homologação */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">📋</span> Fila de Homologação de Prontuários SPA
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Evoluções clínicas submetidas pelos estagiários da turma de estágio
              </p>
            </div>
            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
              {pendentes.length} pendentes
            </span>
          </div>

          <div className="space-y-3">
            {pendentes.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                <span className="text-2xl mb-2 block">🎉</span>
                Todos os prontuários da fila foram revisados e homologados!
              </div>
            ) : (
              pendentes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelecionado(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selecionado?.id === item.id
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <h4 className="font-bold text-gray-900 text-sm">
                        Paciente: {item.pacienteNome}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {item.numeroSessao}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{item.dataSessao}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <p>
                      <strong>Estagiário:</strong> {item.estagiarioNome} ({item.estagiarioMatricula})
                    </p>
                    <p className="text-right">
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Anti-Aspas CFP Ok
                      </span>
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-gray-100 rounded-lg text-xs text-gray-700 space-y-1">
                    <p>
                      <strong className="text-blue-800">Início:</strong> {item.inicioTexto}
                    </p>
                    <p>
                      <strong className="text-blue-800">Meio:</strong> {item.meioTexto}
                    </p>
                    <p>
                      <strong className="text-blue-800">Fim:</strong> {item.fimTexto}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna Direita: Painel de Devolutiva Pedagógica (Prof. Dr. Robert) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                ✍️
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Devolutiva Pedagógica</h3>
                <p className="text-[10px] text-gray-500">Parecer e Homologação Digital (CRP)</p>
              </div>
            </div>

            {selecionado ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-gray-900">{selecionado.pacienteNome}</p>
                  <p className="text-gray-500 text-[11px]">
                    {selecionado.numeroSessao} • Realizada por {selecionado.estagiarioNome}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Parecer Técnico do Supervisor *
                  </label>
                  <textarea
                    rows={6}
                    value={parecer}
                    onChange={(e) => setParecer(e.target.value)}
                    placeholder="Escreva as orientações formativas ou aprovação do registro..."
                    className="w-full p-3 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">
                Selecione uma evolução na fila para avaliar.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2">
            <button
              onClick={handleAprovar}
              disabled={!selecionado || selecionado.status === 'VALIDADO'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span>✔️</span> Homologar com Visto Eletrônico
            </button>
            <button
              onClick={handleDevolver}
              disabled={!selecionado || selecionado.status === 'VALIDADO'}
              className="w-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>↩️</span> Devolver para Ajuste do Aluno
            </button>
          </div>
        </div>
      </div>

      {/* Histórico de Atendimentos Homologados */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <span>📚</span> Histórico de Atendimentos Homologados na Semana (Custódia RT)
        </h4>
        <div className="divide-y divide-gray-100 text-xs">
          {historico.map((h) => (
            <div key={h.id} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-900">{h.pacienteNome}</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-600">{h.numeroSessao} ({h.dataSessao})</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-500">Estagiário: {h.estagiarioNome}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Validado pelo CRP
                </span>
                <button
                  onClick={() => alert(`Parecer do Orientador:\n\n${h.parecerSupervisor}`)}
                  className="text-blue-600 hover:underline font-medium text-[11px]"
                >
                  Ver Parecer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
