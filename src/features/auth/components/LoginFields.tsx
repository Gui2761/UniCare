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
  const { login } = useAuth();
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
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                selectedCourse === 'psicologia'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600/30'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span>Psicologia (Azul Safira)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourse('odontologia')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                selectedCourse === 'odontologia'
                  ? 'border-[#881337] bg-rose-50/70 text-[#881337] shadow-xs ring-1 ring-[#881337]/30'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#881337]"></span>
              <span>Odontologia (Granada)</span>
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/10 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#002B49] hover:bg-[#001D33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex justify-center items-center gap-2 border border-[#001D33]"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 text-[#FFB800]" />
          <span>Acessar Ambiente Clínico UNINASSAU</span>
        </button>
      </form>

      {/* Seção Corporativa de Simulação de Perfis para Homologação */}
      <div className="mt-5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <UserGroupIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Preenchimento Rápido para Avaliação (Banca / Docentes)</span>
          </span>
          <span className="text-[9px] bg-[#002B49] text-[#FFB800] font-mono font-bold px-1.5 py-0.5 rounded">
            RBAC
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveRole('estudante');
              setSelectedCourse('psicologia');
              setIdentifier('16032935');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
              <span>Estag. Psicologia</span>
            </div>
            <div className="text-[9px] text-slate-500">Rikelme (CFP 06/2019)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('estudante');
              setSelectedCourse('odontologia');
              setIdentifier('16024402');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#881337]"></span>
              <span>Estag. Odonto</span>
            </div>
            <div className="text-[9px] text-slate-500">Augusto (CFO)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('docente');
              setSelectedCourse('psicologia');
              setIdentifier('DOC-8821');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
              <span>Supervisor Psico</span>
            </div>
            <div className="text-[9px] text-slate-500">Prof. Robert (CRP 19/0844)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('docente');
              setSelectedCourse('odontologia');
              setIdentifier('DOC-9122');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#881337]"></span>
              <span>Supervisora Odonto</span>
            </div>
            <div className="text-[9px] text-slate-500">Profa. Bianca (CRO 4512)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('recepcao');
              setSelectedCourse('odontologia');
              setIdentifier('REC-2026-01');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span>
              <span>Recepção Central</span>
            </div>
            <div className="text-[9px] text-slate-500">Agenda & Bloqueio RN-001</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('docente');
              setSelectedCourse('psicologia');
              setIdentifier('RT-001');
              setPassword('unicare123');
            }}
            className="p-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition-all shadow-2xs"
          >
            <div className="font-bold text-[#002B49] text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              <span>RT Master (Dra. Camila)</span>
            </div>
            <div className="text-[9px] text-indigo-700 font-medium">Custódia & Indicadores</div>
          </button>
        </div>
      </div>
    </div>

  );
}