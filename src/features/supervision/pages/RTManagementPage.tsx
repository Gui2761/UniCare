import { PsySidebar } from '../../psychology/components/PsySidebar';
import { RTStatsDashboard } from '../components/RTStatsDashboard';
import { useAuth } from '../../auth/context/AuthContext';
import { BuildingOfficeIcon } from '../../../components/icons/CorporateIcons';

export function RTManagementPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Topo / Breadcrumb Corporativo */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5">
              <BuildingOfficeIcon className="w-3.5 h-3.5" />
              <span>Controladoria & Responsabilidade Técnica (RT)</span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">
              UNINASSAU Aracaju • Gestão Integrada Hospitalar (RF-006 & RN-003)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">{user?.nome || 'Dra. Camila'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                {user?.registro_profissional || 'RT Geral Institucional • CRP/CRO'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              RT
            </div>
          </div>
        </div>

        <RTStatsDashboard />
      </main>
    </div>
  );
}
