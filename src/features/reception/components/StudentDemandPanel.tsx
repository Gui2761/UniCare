import { useState } from 'react';
import { useClinic } from '../../clinic/context/ClinicContext';

interface StudentDemandPanelProps {
  cursoFiltro?: 'psicologia' | 'odontologia';
}

export function StudentDemandPanel({ cursoFiltro }: StudentDemandPanelProps) {
  const { demandas, adicionarDemanda } = useClinic();
  const [showNovaDemanda, setShowNovaDemanda] = useState(false);
  const [alunoNome, setAlunoNome] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [prioridade, setPrioridade] = useState<'Alta' | 'Média' | 'Normal'>('Média');

  const demandasFiltradas = demandas.filter(
    (d) => !cursoFiltro || d.curso === cursoFiltro
  );

  const handleNovaDemanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoNome.trim() || !procedimento.trim()) return;

    adicionarDemanda({
      alunoNome,
      alunoMatricula: '16032935',
      curso: cursoFiltro || 'odontologia',
      procedimentoDesejado: procedimento,
      prioridade,
    });

    setAlunoNome('');
    setProcedimento('');
    setShowNovaDemanda(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 font-sans">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span>📋</span> Demandas de Estágio (RF-009)
          </h3>
          <p className="text-[10px] text-gray-500">
            Pacientes solicitados pelos estagiários para a próxima semana
          </p>
        </div>
        <button
          onClick={() => setShowNovaDemanda(!showNovaDemanda)}
          className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          {showNovaDemanda ? 'Fechar' : '+ Nova Solicitação'}
        </button>
      </div>

      {showNovaDemanda && (
        <form onSubmit={handleNovaDemanda} className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-600 mb-1">Nome do Aluno / Dupla</label>
            <input
              type="text"
              required
              value={alunoNome}
              onChange={(e) => setAlunoNome(e.target.value)}
              placeholder="Ex: Rikelme Roma ou Augusto & Gabriela"
              className="w-full p-2 border border-gray-200 rounded bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-600 mb-1">Perfil de Paciente / Procedimento Necessário</label>
            <input
              type="text"
              required
              value={procedimento}
              onChange={(e) => setProcedimento(e.target.value)}
              placeholder="Ex: 1 paciente para raspagem periodontal ou avaliação infantil"
              className="w-full p-2 border border-gray-200 rounded bg-white outline-none"
            />
          </div>
          <div className="flex justify-between items-center pt-1">
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as 'Alta' | 'Média' | 'Normal')}
              className="p-1.5 border border-gray-200 rounded bg-white text-xs outline-none"
            >
              <option value="Alta">Prioridade Alta</option>
              <option value="Média">Prioridade Média</option>
              <option value="Normal">Prioridade Normal</option>
            </select>
            <button
              type="submit"
              className="bg-[#0a1526] hover:bg-black text-white px-4 py-1.5 rounded font-bold text-xs shadow-sm"
            >
              Salvar Demanda
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {demandasFiltradas.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            Nenhuma solicitação pendente no momento.
          </p>
        ) : (
          demandasFiltradas.map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-lg border border-gray-100 bg-[#f8fafc] text-xs space-y-1 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-gray-800">{d.alunoNome}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    d.prioridade === 'Alta'
                      ? 'bg-red-100 text-red-700'
                      : d.prioridade === 'Média'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {d.prioridade}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {d.procedimentoDesejado}
              </p>
              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
                <span>Solicitado em: {d.dataSolicitacao}</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {d.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
