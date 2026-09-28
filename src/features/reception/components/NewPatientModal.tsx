import { useState } from 'react';
import { useClinic } from '../../clinic/context/ClinicContext';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: 'psicologia' | 'odontologia' | 'ambos';
}

export function NewPatientModal({ isOpen, onClose, defaultCourse = 'odontologia' }: NewPatientModalProps) {
  const { cadastrarPaciente } = useClinic();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [curso, setCurso] = useState<'psicologia' | 'odontologia' | 'ambos'>(defaultCourse);
  const [ehMenor, setEhMenor] = useState(false);
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [contatoResponsavel, setContatoResponsavel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nome.trim() || !cpf.trim() || !dataNascimento || !telefone.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const res = cadastrarPaciente({
      nome,
      cpf,
      dataNascimento,
      telefone,
      curso,
      ehMenor,
      nomeResponsavel: ehMenor ? nomeResponsavel : undefined,
      contatoResponsavel: ehMenor ? contatoResponsavel : undefined,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setNome('');
        setCpf('');
        setDataNascimento('');
        setTelefone('');
        setEhMenor(false);
        setNomeResponsavel('');
        setContatoResponsavel('');
        setSuccessMsg('');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              Triagem de Recepção • UC-03
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Novo Cadastro de Paciente</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 font-semibold">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria das Graças Oliveira"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CPF (Verificação Anti-Duplicidade) *</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Data de Nascimento *</label>
              <input
                type="date"
                required
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(79) 90000-0000"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Especialidade / Destino *</label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value as 'psicologia' | 'odontologia' | 'ambos')}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
              >
                <option value="odontologia">Odontologia Clínica</option>
                <option value="psicologia">Psicologia (SPA)</option>
                <option value="ambos">Ambas Especialidades</option>
              </select>
            </div>
          </div>

          {/* Validação de Menor de Idade (RN-004 e UC-03) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ehMenor}
                onChange={(e) => setEhMenor(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-xs font-bold text-gray-700">
                Paciente Menor de Idade (Exige Responsável Legal - RN-004)
              </span>
            </label>

            {ehMenor && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Nome do Responsável Legal *
                  </label>
                  <input
                    type="text"
                    required={ehMenor}
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    placeholder="Mãe, pai ou tutor"
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Contato do Responsável *
                  </label>
                  <input
                    type="text"
                    required={ehMenor}
                    value={contatoResponsavel}
                    onChange={(e) => setContatoResponsavel(e.target.value)}
                    placeholder="(79) 90000-0000"
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white outline-none"
                  />
                </div>
              </div>
            )}
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
              className="px-5 py-2 rounded-lg bg-[#0a1526] hover:bg-black text-white text-xs font-bold shadow"
            >
              Salvar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
