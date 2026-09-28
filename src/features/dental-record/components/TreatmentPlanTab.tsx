import { useState } from 'react';
import { useClinic } from '../../clinic/context/ClinicContext';

export function TreatmentPlanTab() {
  const { planosTratamento } = useClinic();
  const [itens, setItens] = useState(planosTratamento);
  const [showNovo, setShowNovo] = useState(false);

  const [prioridade, setPrioridade] = useState<'Urgência' | 'Fase 1 - Restauradora' | 'Fase 2 - Periodontal' | 'Fase 3 - Manutenção'>('Fase 1 - Restauradora');
  const [denteRegiao, setDenteRegiao] = useState('');
  const [procedimento, setProcedimento] = useState('');

  const handleSalvarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!denteRegiao.trim() || !procedimento.trim()) return;

    setItens([
      ...itens,
      {
        id: Date.now(),
        prioridade,
        denteRegiao,
        procedimento,
        status: 'Planejado',
        estagiarioResponsavel: 'Augusto Cesar Farias',
      },
    ]);

    setDenteRegiao('');
    setProcedimento('');
    setShowNovo(false);
  };

  const getPriorityBadge = (p: string) => {
    if (p.includes('Urgência')) {
      return <span className="bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-red-200">1. Urgência Máxima</span>;
    }
    if (p.includes('Restauradora')) {
      return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-blue-200">2. Dentística / Restauração</span>;
    }
    if (p.includes('Periodontal')) {
      return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-amber-200">3. Periodontia</span>;
    }
    return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded text-[11px]">4. Manutenção</span>;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span>📋</span> Plano de Tratamento Hierarquizado (Do mais urgente ao mais simples)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Estrutura obrigatória validada pela coordenação do curso de Odontologia (Profa. Bianca Nubia)
          </p>
        </div>
        <button
          onClick={() => setShowNovo(!showNovo)}
          className="bg-[#0a1526] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          {showNovo ? 'Fechar' : '+ Adicionar Procedimento'}
        </button>
      </div>

      {showNovo && (
        <form onSubmit={handleSalvarItem} className="bg-white p-5 rounded-xl border border-blue-400 shadow-md space-y-3 text-xs">
          <div className="font-bold text-gray-900 text-xs mb-1">Novo Procedimento no Plano:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Hierarquia de Urgência *</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as unknown as typeof prioridade)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              >
                <option value="Urgência">1. Urgência / Dor</option>
                <option value="Fase 1 - Restauradora">2. Fase 1 - Restauradora</option>
                <option value="Fase 2 - Periodontal">3. Fase 2 - Periodontal</option>
                <option value="Fase 3 - Manutenção">4. Fase 3 - Manutenção / Profilaxia</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Dente / Região *</label>
              <input
                type="text"
                required
                value={denteRegiao}
                onChange={(e) => setDenteRegiao(e.target.value)}
                placeholder="Ex: Dente 24 ou Geral"
                className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Procedimento Planejado *</label>
              <input
                type="text"
                required
                value={procedimento}
                onChange={(e) => setProcedimento(e.target.value)}
                placeholder="Ex: Tratamento de canal ou coroa"
                className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowNovo(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Inserir no Plano
            </button>
          </div>
        </form>
      )}

      {/* Tabela de Procedimentos do Plano */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px]">
            <tr>
              <th className="py-3 px-4">Prioridade / Fase</th>
              <th className="py-3 px-4">Dente / Região</th>
              <th className="py-3 px-4">Procedimento</th>
              <th className="py-3 px-4">Responsável</th>
              <th className="py-3 px-4">Status de Execução</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itens.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">{getPriorityBadge(item.prioridade)}</td>
                <td className="py-3.5 px-4 font-bold text-gray-800">{item.denteRegiao}</td>
                <td className="py-3.5 px-4 text-gray-700 font-medium">{item.procedimento}</td>
                <td className="py-3.5 px-4 text-gray-500">{item.estagiarioResponsavel}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Concluído'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Em Andamento'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
