import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, switchUser } = useAuth();

  const attemptedPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || location.pathname;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl font-bold">
            🚫
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Violação de Acesso • Norma RN-001 / LGPD
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Acesso Estritamente Restrito</h1>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-sm text-red-800 space-y-2">
          <p className="font-semibold">
            Critério de Aceite CA-01 / Resolução CFP nº 06/2019:
          </p>
          <p>
            O perfil atual (<strong className="capitalize">{user?.perfil || 'Não autenticado'}</strong>: {user?.nome}) não tem permissão para visualizar o conteúdo de prontuários clínicos ou fichas evolutivas da rota{' '}
            <code className="bg-red-100 px-1 py-0.5 rounded text-red-900 font-mono text-xs">{attemptedPath}</code>.
          </p>
          <p className="text-xs text-red-600">
            Perfis de Recepção têm acesso restrito à gestão de agendamentos e horários presenciais, sendo vedado o acesso a dados de saúde mental e anamnese.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500 mb-3 font-medium">Alternar perfil institucional para teste de homologação:</p>
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            <button
              onClick={() => {
                switchUser('estagiario_psico');
                navigate('/psi/prontuario');
              }}
              className="p-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
            >
              <div className="font-bold text-gray-800">Estagiário Psicologia</div>
              <div className="text-gray-500 text-[10px]">Rikelme Roma</div>
            </button>
            <button
              onClick={() => {
                switchUser('estagiario_odonto');
                navigate('/ficha-odonto');
              }}
              className="p-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
            >
              <div className="font-bold text-gray-800">Estagiário Odontologia</div>
              <div className="text-gray-500 text-[10px]">Augusto Cesar</div>
            </button>
            <button
              onClick={() => {
                switchUser('supervisor_psico');
                navigate('/psi/supervisao');
              }}
              className="p-2.5 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all"
            >
              <div className="font-bold text-gray-800">Supervisor Docente</div>
              <div className="text-gray-500 text-[10px]">Prof. Robert (CRP)</div>
            </button>
            <button
              onClick={() => {
                switchUser('recepcao');
                navigate('/recepcao');
              }}
              className="p-2.5 rounded-lg border border-gray-200 hover:border-gray-500 hover:bg-gray-50 text-left transition-all"
            >
              <div className="font-bold text-gray-800">Voltar à Recepção</div>
              <div className="text-gray-500 text-[10px]">Agenda Logística</div>
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              &larr; Voltar à página anterior
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#0a1526] hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
            >
              Ir para Tela de Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
