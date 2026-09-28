import { useState } from 'react';
import { useClinic } from '../../clinic/context/ClinicContext';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: 'psicologia' | 'odontologia';
}

export function NewAppointmentModal({ isOpen, onClose, defaultCourse = 'odontologia' }: NewAppointmentModalProps) {
  const { pacientes, adicionarAgendamento } = useClinic();

  const [pacienteId, setPacienteId] = useState<number>(pacientes[0]?.id || 1);
  const [curso, setCurso] = useState<'psicologia' | 'odontologia'>(defaultCourse);
  const [estagiarioNome, setEstagiarioNome] = useState(
    defaultCourse === 'psicologia' ? 'Rikelme Roma Santos' : 'Augusto Cesar Farias'
  );
  const [horario, setHorario] = useState('14:30');
  const [turno, setTurno] = useState<'manha' | 'tarde' | 'noite'>('tarde');
  const [salaOuCadeira, setSalaOuCadeira] = useState(
    defaultCourse === 'psicologia' ? 'Consultório SPA-03' : 'Cadeira Odonto 05'
  );
  const [tipoConsulta, setTipoConsulta] = useState(
    defaultCourse === 'psicologia' ? 'Sessão Psicoterapia TCC' : 'Restauração Dentária'
  );
  const [observacaoLogistica, setObservacaoLogistica] = useState('Primeira consulta do semestre');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paciente = pacientes.find((p) => p.id === Number(pacienteId));
    if (!paciente) return;

    adicionarAgendamento({
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      estagiarioNome,
      estagiarioMatricula: '16032935',
      curso,
      horario,
      turno,
      salaOuCadeira,
      tipoConsulta,
      status: 'AGENDADO',
      observacaoLogistica,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Logística de Recepção • UC-02 / RF-002
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Novo Agendamento Clínico</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Selecione o Paciente Cadastrado *</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — CPF: {p.cpf} {p.ehMenor ? '(Menor de Idade)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Especialidade</label>
              <select
                value={curso}
                onChange={(e) => {
                  const val = e.target.value as 'psicologia' | 'odontologia';
                  setCurso(val);
                  if (val === 'psicologia') {
                    setSalaOuCadeira('Consultório SPA-02');
                    setEstagiarioNome('Rikelme Roma Santos');
                  } else {
                    setSalaOuCadeira('Cadeira Odonto 03');
                    setEstagiarioNome('Augusto Cesar Farias');
                  }
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              >
                <option value="odontologia">Odontologia</option>
                <option value="psicologia">Psicologia (SPA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Estagiário Responsável</label>
              <input
                type="text"
                required
                value={estagiarioNome}
                onChange={(e) => setEstagiarioNome(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Turno</label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as 'manha' | 'tarde' | 'noite')}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              >
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Horário</label>
              <input
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sala / Cadeira</label>
              <input
                type="text"
                value={salaOuCadeira}
                onChange={(e) => setSalaOuCadeira(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Procedimento / Motivo</label>
            <input
              type="text"
              value={tipoConsulta}
              onChange={(e) => setTipoConsulta(e.target.value)}
              placeholder="Ex: Restauração, Avaliação, Consulta de Retorno..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Observação Logística da Recepção</label>
            <textarea
              rows={2}
              value={observacaoLogistica}
              onChange={(e) => setObservacaoLogistica(e.target.value)}
              placeholder="Avisos sobre transporte, acompanhante, etc. (Nunca dados clínicos)"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0056b3] hover:bg-blue-800 text-white text-xs font-bold shadow"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
