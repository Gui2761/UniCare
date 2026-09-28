import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LockClosedIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '../../../components/icons/CorporateIcons';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, switchUser } = useAuth();

  const attemptedPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || location.pathname;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-3.5 text-red-600 mb-5">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200">
            <LockClosedIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              Controle de Acesso RBAC • Norma RN-001 & LGPD
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Acesso Restrito ao Módulo Clínico</h1>
          </div>
        </div>

        <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl mb-6 text-xs text-red-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-red-700 shrink-0" />
            <span>Salvaguarda Regulamentar Ativa (Resolução CFP nº 06/2019 & CFO):</span>
          </p>
          <p className="leading-relaxed">
            O perfil atual (<strong className="capitalize">{user?.perfil || 'Não autenticado'}</strong>: {user?.nome}) não possui autorização legal para visualizar o conteúdo de prontuários clínicos da rota{' '}
            <code className="bg-red-100 px-1.5 py-0.5 rounded text-red-950 font-mono text-[11px] font-bold">{attemptedPath}</code>.
          </p>
          <p className="text-[11px] text-red-700 leading-relaxed">
            Perfis de Recepção têm acesso restrito ao fluxo de agendamento e acolhimento presencial, sendo expressamente vedado o acesso a anotações psicoterápicas ou fichas evolutivas.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <UserGroupIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Simular Perfil Autorizado para Homologação:</span>
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                switchUser('estagiario_psico');
                navigate('/psi/prontuario');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">Estagiário Psicologia</div>
              <div className="text-slate-500 text-[10px]">Rikelme Roma Santos</div>
            </button>
            <button
              type="button"
              onClick={() => {
                switchUser('estagiario_odonto');
                navigate('/ficha-odonto');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-left transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">Estagiário Odontologia</div>
              <div className="text-slate-500 text-[10px]">Augusto Cesar Farias</div>
            </button>
            <button
              type="button"
              onClick={() => {
                switchUser('supervisor_psico');
                navigate('/psi/supervisao');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">Supervisor Docente</div>
              <div className="text-slate-500 text-[10px]">Prof. Dr. Robert Santos</div>
            </button>
            <button
              type="button"
              onClick={() => {
                switchUser('recepcao');
                navigate('/recepcao');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">Voltar à Recepção</div>
              <div className="text-slate-500 text-[10px]">Agenda Logística Geral</div>
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              ← Voltar à página anterior
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Ir para Tela de Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
