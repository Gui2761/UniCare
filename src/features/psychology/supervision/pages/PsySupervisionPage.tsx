import { PsySidebar } from '../../components/PsySidebar';
import { PsyTeacherHeader } from '../components/PsyTeacherHeader';
import { PsySupervisionStats } from '../components/PsySupervisionStats';
import { PsyApprovalQueue } from '../components/PsyApprovalQueue';

export function PsySupervisionPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Topo / Breadcrumb */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">SPA / Psicologia Clínica</span>
            <span>•</span>
            <span className="text-gray-500">Clínica-Escola UNINASSAU Aracaju • Serviço de Psicologia Aplicada</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">🔔</button>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">Prof. Dr. Robert Santos do Carmo</p>
              <p className="text-[10px] text-gray-500">Supervisor Docente • CRP 19/0844</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              RS
            </div>
          </div>
        </div>

        <PsyTeacherHeader />
        <PsySupervisionStats />

        {/* Fila de Homologação Real e Devolutiva Pedagógica */}
        <div className="mb-8">
          <PsyApprovalQueue />
        </div>

        {/* Estagiários sob Orientação Docente (Segregação por Turma - RF-004 e RN-003) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>👥</span> Estagiários sob Orientação Docente (Turma Terça Tarde - RF-004)
              </h4>
              <p className="text-xs text-gray-500">
                O professor supervisor só visualiza e valida prontuários dos alunos vinculados à sua orientação
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
              4 estagiários alocados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#f8fafc]">
              <p className="font-bold text-gray-900">Rikelme Roma Santos</p>
              <p className="text-gray-500 text-[11px]">Matrícula: 16032935 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                3 prontuários homologados
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#f8fafc]">
              <p className="font-bold text-gray-900">João Kaio Rodrigues</p>
              <p className="text-gray-500 text-[11px]">Matrícula: 16031730 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                2 prontuários homologados
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#f8fafc]">
              <p className="font-bold text-gray-900">Augusto Cesar Farias</p>
              <p className="text-gray-500 text-[11px]">Matrícula: 16024402 • 9º P.</p>
              <div className="mt-2 text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                Especialidade: Odontologia
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#f8fafc]">
              <p className="font-bold text-gray-900">Marlon Bruno dos Santos</p>
              <p className="text-gray-500 text-[11px]">Matrícula: 16032601 • 9º P.</p>
              <div className="mt-2 text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                Especialidade: Odontologia
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}