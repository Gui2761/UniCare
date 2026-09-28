import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '../../../components/icons/CorporateIcons';

export function ClinicalPairs() {
  const pairs = [
    { id: 'D1', name: 'L. Vasconcelos / G. Prado', chair: 'Cadeira 03', proc: '14 / 20', status: 'Pendente', patients: '2 Pacientes no Dia', color: 'bg-slate-900 text-white' },
    { id: 'D2', name: 'B. Morais / P. Siqueira', chair: 'Cadeira 04', proc: '12 / 20', status: 'Pendente', patients: '2 Pacientes no Dia', color: 'bg-emerald-700 text-white' },
    { id: 'D3', name: 'T. Nogueira / M. Figueira', chair: 'Cadeira 02', proc: '18 / 20', status: 'Em Análise', patients: '3 Pacientes Ativos', color: 'bg-blue-100 text-blue-900' },
    { id: 'D4', name: 'C. Castro / R. Lima', chair: 'Cadeira 08', proc: '16 / 20', status: 'Em Dia', patients: '2 Pacientes Ativos', color: 'bg-slate-900 text-white' },
    { id: 'D5', name: 'M. Arantes / J. Costa', chair: 'Cadeira 09', proc: '11 / 20', status: 'Correção', patients: '1 Paciente Ativo', color: 'bg-red-50 text-red-700 border border-red-200' },
    { id: 'D6', name: 'F. Toledo / B. Neves', chair: 'Cadeira 11', proc: '15 / 20', status: 'Em Dia', patients: '2 Pacientes no Dia', color: 'bg-emerald-700 text-white' },
    { id: 'D7', name: 'S. Dantas / E. Rocha', chair: 'Cadeira 06', proc: '17 / 20', status: 'Em Dia', patients: '2 Pacientes no Dia', color: 'bg-blue-100 text-blue-900' },
    { id: 'D8', name: 'C. Barros / T. Freitas', chair: 'Cadeira 10', proc: '13 / 20', status: 'Pendente', patients: '2 Pacientes no Dia', color: 'bg-slate-900 text-white' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-emerald-800" />
            <span>Duplas Clínicas sob Orientação Docente (12 Duplas Ativas)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento de carga horária prática, procedimentos odontológicos homologados e biossegurança.
          </p>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar aluno ou dupla..." 
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {pairs.map((pair, idx) => (
          <div key={idx} className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition-colors">
            <div className="flex gap-3 items-start mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs ${pair.color}`}>
                {pair.id}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Dupla 0{idx + 1} • {pair.chair}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{pair.name}</p>
              </div>
            </div>
            <div className="text-[10px] border-t border-slate-200/60 pt-3 flex justify-between items-center">
              <div>
                <p className="text-slate-400 uppercase font-semibold">Procedimentos</p>
                <p className="font-bold text-slate-900 font-mono">Homologados: <span className="text-emerald-700">{pair.proc}</span></p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">{pair.patients}</p>
                <p className={`font-bold ${pair.status === 'Em Dia' ? 'text-emerald-700' : pair.status === 'Pendente' ? 'text-amber-700' : pair.status === 'Correção' ? 'text-red-700' : 'text-blue-700'}`}>
                  {pair.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de Paginação Inferior */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Exibindo 8 de 12 duplas alocadas na Turma ODO-2026.2-D1
        </p>
        <button
          type="button"
          className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-200/70"
        >
          <span>Visualizar Matriz Completa</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}