import { AppLayout } from '../../../../components/layout/AppLayout';
import { PsyTeacherHeader } from '../components/PsyTeacherHeader';
import { PsySupervisionStats } from '../components/PsySupervisionStats';
import { PsyApprovalQueue } from '../components/PsyApprovalQueue';
import { UserGroupIcon } from '../../../../components/icons/CorporateIcons';

export function PsySupervisionPage() {
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

        {/* Fila de Homologação Real e Devolutiva Pedagógica */}
        <PsyApprovalQueue />

        {/* Estagiários sob Orientação Docente */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider">
                <UserGroupIcon className="w-4 h-4 text-blue-700" />
                <span>Estagiários sob Orientação Docente (Turma Terça Tarde • RF-004)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Segregação por orientação: o supervisor visualiza e valida exclusivamente prontuários dos acadêmicos vinculados à sua turma.
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-3 py-1 rounded-full">
              4 acadêmicos vinculados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <p className="font-bold text-slate-900">Rikelme Roma Santos</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16032935 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block font-mono">
                Homologado no prazo
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <p className="font-bold text-slate-900">João Kaio Rodrigues</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16031730 • 9º P.</p>
              <div className="mt-2 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block font-mono">
                Homologado no prazo
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <p className="font-bold text-slate-900">Lucas Vasconcelos</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16030991 • 10º P.</p>
              <div className="mt-2 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block font-mono">
                Em atendimento
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <p className="font-bold text-slate-900">Mariana Albuquerque</p>
              <p className="text-slate-500 text-[11px] font-mono">Matrícula: 16029811 • 9º P.</p>
              <div className="mt-2 text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 inline-block font-mono">
                Aguardando sessão
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}