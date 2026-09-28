import { PsySidebar } from '../../components/PsySidebar';
import { PsyTeacherHeader } from '../components/PsyTeacherHeader';
import { PsySupervisionStats } from '../components/PsySupervisionStats';
import { PsyApprovalQueue } from '../components/PsyApprovalQueue';
import {
  UserGroupIcon,
  ShieldCheckIcon,
} from '../../../../components/icons/CorporateIcons';

export function PsySupervisionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Topo / Breadcrumb Corporativo */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-blue-700 flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>SPA • Supervisão Docente de Psicologia</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">
              Fila de Vistos Eletrônicos & Homologação de Prontuários (RF-004)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">Prof. Dr. Robert Santos do Carmo</p>
              <p className="text-[10px] text-slate-500 font-mono">Orientador Docente • CRP 19/0844</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider">
                <UserGroupIcon className="w-4 h-4 text-blue-700" />
                <span>Estagiários sob Orientação Docente (Turma Terça Tarde - RF-004)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Segregação institucional: o professor supervisor visualiza e valida apenas prontuários dos alunos vinculados à sua orientação.
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-3 py-1 rounded-md">
              4 estagiários alocados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="font-bold text-slate-900">Rikelme Roma Santos</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16032935 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-mono">
                Homologado no prazo
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="font-bold text-slate-900">João Kaio Rodrigues</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16031730 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-mono">
                Homologado no prazo
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="font-bold text-slate-900">Lucas Vasconcelos</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16030991 • 10º P.</p>
              <div className="mt-2 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block font-mono">
                Em atendimento
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="font-bold text-slate-900">Mariana Albuquerque</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16029811 • 9º P.</p>
              <div className="mt-2 text-[10px] text-slate-600 font-bold bg-slate-200 px-2 py-0.5 rounded border border-slate-300 inline-block font-mono">
                Aguardando sessão
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}