import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
} from '../../../components/icons/CorporateIcons';

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
    <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Portal Institucional • Acesso Seguro
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Autenticação Corporativa</h2>
        <p className="text-xs text-slate-500 mt-1">
          Informe suas credenciais acadêmicas ou selecione seu módulo de atuação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seletor de Papel */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Perfil de Acesso
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
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
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeRole === role
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'docente' ? 'Docente / RT' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Especialidade Clínica */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Módulo de Atuação Clínica
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourse('psicologia')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                selectedCourse === 'psicologia'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Psicologia Clínica (SPA)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourse('odontologia')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                selectedCourse === 'odontologia'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Odontologia Integrada
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Matrícula ou E-mail Institucional
          </label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Matrícula ou e-mail"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">Senha de Acesso</label>
            <a href="/recuperar-senha" className="text-xs text-blue-700 hover:underline font-medium">
              Recuperar
            </a>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span>Acessar Ambiente Clínico</span>
        </button>
      </form>

      {/* Seção Corporativa de Simulação de Perfis para Homologação */}
      <div className="mt-5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <UserGroupIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulação Imediata de Perfis (Banca / Docentes)</span>
          </span>
          <span className="text-[9px] bg-slate-200 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
            RBAC Ativo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLogin('estagiario_psico', '/psi/prontuario')}
            className="p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px]">Estag. Psicologia</div>
            <div className="text-[9px] text-slate-500">Prontuário SPA (CFP 06/2019)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('estagiario_odonto', '/ficha-odonto')}
            className="p-2 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px]">Estag. Odonto</div>
            <div className="text-[9px] text-slate-500">Ficha Clínica & Odontograma</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('supervisor_psico', '/psi/supervisao')}
            className="p-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px]">Supervisor Psico</div>
            <div className="text-[9px] text-slate-500">Prof. Robert (Vistos)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('supervisor_odonto', '/supervisao')}
            className="p-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px]">Supervisora Odonto</div>
            <div className="text-[9px] text-slate-500">Profa. Bianca (CFO)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('recepcao', '/recepcao')}
            className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px]">Recepção Central</div>
            <div className="text-[9px] text-slate-500">Bloqueio Clínico (RN-001)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('rt_master', '/rt/relatorios')}
            className="p-2 rounded-xl bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-indigo-950 text-[11px]">RT Master (Dra. Camila)</div>
            <div className="text-[9px] text-indigo-600 font-medium">Custódia & Indicadores</div>
          </button>
        </div>
      </div>
    </div>
  );
}