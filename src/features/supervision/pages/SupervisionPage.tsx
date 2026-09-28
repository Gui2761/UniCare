import { Sidebar } from '../../dental-record/components/Sidebar';
import { TeacherHeader } from '../components/TeacherHeader';
import { SupervisionStats } from '../components/SupervisionStats';
import { ApprovalQueue } from '../components/ApprovalQueue';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { PedagogicalHistory } from '../components/PedagogicalHistory';
import { ClinicalPairs } from '../components/ClinicalPairs';
import { ShieldCheckIcon } from '../../../components/icons/CorporateIcons';

export function SupervisionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Clínica Odontológica UNINASSAU
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Supervisão Docente & Fila de Vistos (CFO)</span>
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">Profa. Dra. Bianca Nubia</p>
            <p className="text-[10px] text-slate-500 font-mono">Orientadora de Estágio • CRO-SE 4512</p>
          </div>
        </div>

        <TeacherHeader />
        <SupervisionStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ApprovalQueue />
          </div>
          <div className="lg:col-span-1">
            <FeedbackPanel />
          </div>
        </div>

        <PedagogicalHistory />
        <ClinicalPairs />
      </main>
    </div>
  );
}