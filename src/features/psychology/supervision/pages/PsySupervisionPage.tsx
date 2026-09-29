import { useState } from 'react';
import { AppLayout } from '../../../../components/layout/AppLayout';
import { PsyTeacherHeader } from '../components/PsyTeacherHeader';
import { PsySupervisionStats } from '../components/PsySupervisionStats';
import { PsyApprovalQueue } from '../components/PsyApprovalQueue';
import {
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '../../../../components/icons/CorporateIcons';
import { useAuth } from '../../../auth/context/AuthContext';

export function PsySupervisionPage() {
  const { allUsers, createUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [periodo, setPeriodo] = useState('9º Período');
  const [turma, setTurma] = useState('Turma Terça Tarde (SPA)');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  // Estagiários de Psicologia registrados no sistema
  const psicoInterns = Object.entries(allUsers || {}).filter(
    ([_, u]) => u.curso === 'psicologia' && u.perfil === 'estagiario'
  );

  const handleCreateIntern = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!nome.trim() || !matricula.trim()) {
      setValidationError('Nome completo e Matrícula são obrigatórios.');
      return;
    }

    const cleanMatricula = matricula.trim();
    const cleanEmail =
      email.trim() ||
      `${nome.trim().toLowerCase().split(' ')[0]}.${cleanMatricula}@uninassau.edu.br`;

    createUser({
      nome: nome.trim(),
      matricula: cleanMatricula,
      email: cleanEmail,
      perfil: 'estagiario',
      curso: 'psicologia',
      registro_profissional: `${periodo} • ${turma}`,
    });

    setFeedbackSuccess(
      `Estagiário ${nome.trim()} cadastrado com sucesso! Já está visível na tela de login de Psicologia.`
    );
    setNome('');
    setMatricula('');
    setEmail('');
    setShowCreateModal(false);

    setTimeout(() => {
      setFeedbackSuccess('');
    }, 6000);
  };

  return (
    <AppLayout
      title="Supervisão Docente de Psicologia (SPA)"
      subtitle="Fila de homologação de prontuários eletrônicos, vistos digitais e devolutivas formativas sob a Resolução CFP nº 06/2019"
      badge="Resolução CFP nº 06/2019"
      badgeType="blue"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <PsyTeacherHeader />
        <PsySupervisionStats />

        {/* Feedback Toast de Sucesso */}
        {feedbackSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-800 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{feedbackSuccess}</span>
            </div>
            <button
              onClick={() => setFeedbackSuccess('')}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Fila de Homologação Real e Devolutiva Pedagógica */}
        <PsyApprovalQueue />

        {/* Estagiários sob Orientação Docente */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider">
                <UserGroupIcon className="w-4 h-4 text-blue-700" />
                <span>Estagiários sob Orientação Docente ({turma} • RF-004)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Segregação por orientação: o supervisor visualiza e valida exclusivamente prontuários dos acadêmicos vinculados à sua turma.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold px-3 py-1 rounded-full">
                {psicoInterns.length} acadêmicos vinculados
              </span>
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setShowCreateModal(true);
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 border border-blue-900"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Cadastrar Estagiário</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {psicoInterns.map(([key, intern]) => (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all ${
                  intern.custom
                    ? 'border-blue-300 bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-900 truncate">{intern.nome}</p>
                  {intern.custom && (
                    <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      Novo
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] font-mono">
                  Matrícula: {intern.matricula}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {intern.registro_profissional || '9º Período • Turma Terça'}
                </p>
                <div className="mt-2.5 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block font-mono">
                  Habilitado no Login
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Criação de Estagiário (SPA Psicologia) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  SPA
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cadastrar Estagiário (Psicologia)</h3>
                  <p className="text-[10px] text-slate-500">
                    O perfil será gerado e exibido automaticamente na tela de login.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIntern} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nome Completo do Acadêmico *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Beatriz Lima Ribeiro"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Matrícula Acadêmica *
                  </label>
                  <input
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 16038910"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Período do Curso
                  </label>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600"
                  >
                    <option value="9º Período">9º Período</option>
                    <option value="10º Período">10º Período</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  E-mail Institucional (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: beatriz.ribeiro@uninassau.edu.br"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Turma de Orientação Docente
                </label>
                <input
                  type="text"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              {validationError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {validationError}
                </div>
              )}

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheckIcon className="w-4 h-4 text-blue-700" />
                  <span>Autenticação & Segurança (RBAC)</span>
                </div>
                <p className="text-[10px] text-slate-600">
                  O estagiário será criado com a senha padrão <code className="font-mono font-bold bg-white px-1 py-0.5 rounded border border-blue-200">unicare123</code>. Ele aparecerá no card rápido de Psicologia, mas precisará digitar a senha para acessar.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-xs border border-blue-900 flex items-center gap-1.5"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Cadastrar e Habilitar Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}