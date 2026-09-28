import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RoleType = 'estudante' | 'docente' | 'recepcao';

export function LoginFields() {
  const navigate = useNavigate();
  const { login, switchUser } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleType>('estudante');
  const [selectedCourse, setSelectedCourse] = useState<'psicologia' | 'odontologia'>('psicologia');
  const [identifier, setIdentifier] = useState('16032935');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeRole === 'recepcao') {
      login('recepcao');
      navigate(selectedCourse === 'psicologia' ? '/psi/recepcao' : '/recepcao');
    } else if (activeRole === 'docente') {
      if (selectedCourse === 'psicologia') {
        login('supervisor_psico');
        navigate('/psi/supervisao');
      } else {
        login('supervisor_odonto');
        navigate('/supervisao');
      }
    } else {
      // Estudante / Estagiário
      if (selectedCourse === 'psicologia') {
        login('estagiario_psico');
        navigate('/psi/prontuario');
      } else {
        login('estagiario_odonto');
        navigate('/ficha-odonto');
      }
    }
  };

  const handleQuickLogin = (presetKey: string, targetRoute: string) => {
    switchUser(presetKey);
    navigate(targetRoute);
  };

  return (
    <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-semibold text-blue-700 mb-3 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Acesso Seguro • Portal Clínico Integrado
        </span>
        <h2 className="text-3xl font-bold mb-1 text-[#0a1526]">Entrar no UniCare</h2>
        <p className="text-gray-500 text-xs">
          Clínica-Escola UNINASSAU • Selecione seu papel institucional e especialidade.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seletor de Papel */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">
            Perfil de Acesso
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['estudante', 'docente', 'recepcao'] as RoleType[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveRole(role);
                  if (role === 'estudante') setIdentifier('16032935');
                  if (role === 'docente') setIdentifier('robert.carmo@uninassau.edu.br');
                  if (role === 'recepcao') setIdentifier('recepcao@uninassau.edu.br');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                  activeRole === role
                    ? 'bg-white text-[#0a1526] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {role === 'docente' ? 'Docente / RT' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Especialidade Clínica */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">
            Especialidade Clínica
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourse('psicologia')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                selectedCourse === 'psicologia'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>🧠</span> Psicologia (SPA)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourse('odontologia')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                selectedCourse === 'odontologia'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>🦷</span> Odontologia
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Matrícula ou E-mail Institucional
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">👤</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Matrícula ou e-mail"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-gray-700">Senha</label>
            <a href="/recuperar-senha" className="text-xs text-blue-600 hover:underline">
              Esqueceu?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0a1526] hover:bg-black text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow flex justify-center items-center gap-2"
        >
          <span>🚪</span> Acessar Plataforma UniCare
        </button>
      </form>

      {/* Seção de Demonstração Rápida para Avaliação de Projeto */}
      <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <span>⚡</span> Acesso Rápido de Homologação (Banca/Docentes)
          </span>
          <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
            RBAC Ativo
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => handleQuickLogin('estagiario_psico', '/psi/prontuario')}
            className="p-1.5 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-all"
          >
            <div className="font-bold text-gray-800">Estag. Psicologia</div>
            <div className="text-[9px] text-gray-500">Prontuário SPA</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('estagiario_odonto', '/ficha-odonto')}
            className="p-1.5 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-all"
          >
            <div className="font-bold text-gray-800">Estag. Odonto</div>
            <div className="text-[9px] text-gray-500">Ficha Clínica + SVG</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('supervisor_psico', '/psi/supervisao')}
            className="p-1.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all"
          >
            <div className="font-bold text-gray-800">Supervisor Docente</div>
            <div className="text-[9px] text-gray-500">Homologação Turma</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('recepcao', '/recepcao')}
            className="p-1.5 rounded bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-left transition-all"
          >
            <div className="font-bold text-gray-800">Recepção Geral</div>
            <div className="text-[9px] text-gray-500">Agenda / Bloqueio RN-01</div>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
        <span className="text-gray-500">Novo estagiário clínico?</span>
        <a href="/cadastro" className="text-blue-600 font-bold hover:underline">
          Solicitar Acesso &rarr;
        </a>
      </div>
    </div>
  );
}