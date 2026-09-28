import { useState } from 'react';
import { useClinic } from '../../clinic/context/ClinicContext';
import type { StatusAgendamento } from '../../clinic/context/ClinicContext';

interface AppointmentTableProps {
  cursoFiltro?: 'psicologia' | 'odontologia';
}

export function AppointmentTable({ cursoFiltro }: AppointmentTableProps) {
  const { agendamentos, atualizarStatusAgendamento } = useClinic();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');

  const itensFiltrados = agendamentos.filter((a) => {
    if (cursoFiltro && a.curso !== cursoFiltro) return false;
    if (statusFiltro !== 'TODOS' && a.status !== statusFiltro) return false;
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      return (
        a.pacienteNome.toLowerCase().includes(termo) ||
        a.estagiarioNome.toLowerCase().includes(termo) ||
        a.salaOuCadeira.toLowerCase().includes(termo)
      );
    }
    return true;
  });

  const getStatusBadge = (status: StatusAgendamento) => {
    switch (status) {
      case 'AGENDADO':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">Agendado</span>;
      case 'PRESENTE':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Presente</span>;
      case 'EM_ATENDIMENTO':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span> Em Atendimento</span>;
      case 'CONCLUIDO':
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-bold">Concluído</span>;
      case 'FALTOU':
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-bold">Faltou</span>;
      case 'CANCELADO':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      {/* Alerta de Conformidade RN-001 (Visão Exclusivamente Logística da Recepção) */}
      <div className="bg-slate-900 text-slate-300 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">🔒</span>
          <span>
            <strong>Controle Logístico Estrito (RN-001 / CFP nº 06/2019):</strong> Recepção sem acesso ao histórico ou dados clínicos.
          </span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
          {itensFiltrados.length} registros ativos
        </span>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {['TODOS', 'AGENDADO', 'PRESENTE', 'EM_ATENDIMENTO', 'CONCLUIDO', 'FALTOU'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFiltro(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFiltro === st
                  ? 'bg-[#0a1526] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st === 'TODOS' ? 'Todos os Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por paciente, aluno ou sala..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Tabela de Atendimentos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Horário / Turno</th>
              <th className="py-3 px-4">Paciente</th>
              <th className="py-3 px-4">Local / Especialidade</th>
              <th className="py-3 px-4">Estagiário Responsável</th>
              <th className="py-3 px-4">Status Presença</th>
              <th className="py-3 px-4 text-right">Ações da Recepção</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itensFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  Nenhum agendamento encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              itensFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900 text-sm">{item.horario}</p>
                    <p className="text-[10px] text-gray-500 capitalize">Turno: {item.turno}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{item.pacienteNome}</p>
                    <p className="text-[10px] text-gray-500 italic">{item.observacaoLogistica}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800">{item.salaOuCadeira}</p>
                    <p className="text-[10px] text-blue-600 font-medium capitalize">{item.tipoConsulta}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-800">{item.estagiarioNome}</p>
                    <p className="text-[10px] text-gray-400">Matrícula: {item.estagiarioMatricula}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {item.status === 'AGENDADO' && (
                        <button
                          onClick={() => atualizarStatusAgendamento(item.id, 'PRESENTE')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors shadow-sm"
                          title="Marcar que o paciente chegou à recepção"
                        >
                          ✓ Dar Presença
                        </button>
                      )}

                      {item.status === 'PRESENTE' && (
                        <button
                          onClick={() => atualizarStatusAgendamento(item.id, 'EM_ATENDIMENTO')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors shadow-sm"
                          title="Paciente encaminhado para a sala/cadeira"
                        >
                          ▶ Iniciar
                        </button>
                      )}

                      {item.status === 'EM_ATENDIMENTO' && (
                        <button
                          onClick={() => atualizarStatusAgendamento(item.id, 'CONCLUIDO')}
                          className="bg-slate-700 hover:bg-slate-900 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors shadow-sm"
                        >
                          Concluir
                        </button>
                      )}

                      {item.status === 'AGENDADO' && (
                        <button
                          onClick={() => atualizarStatusAgendamento(item.id, 'FALTOU')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-[11px] border border-rose-200 transition-colors"
                          title="Registrar ausência do paciente"
                        >
                          Falta
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
