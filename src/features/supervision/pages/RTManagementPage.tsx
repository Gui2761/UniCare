import { PsySidebar } from '../../psychology/components/PsySidebar';
import { RTStatsDashboard } from '../components/RTStatsDashboard';
import { useAuth } from '../../auth/context/AuthContext';

export function RTManagementPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Topo / Breadcrumb */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold text-purple-700 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Referência Técnica (RT) Master
            </span>
            <span>•</span>
            <span className="text-gray-500">
              UNINASSAU Aracaju • Gestão Integrada de Clínicas (RF-006 & RN-003)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{user?.nome || 'Dra. Camila (RT Master)'}</p>
              <p className="text-[10px] text-gray-500">
                {user?.registro_profissional || 'RT Geral Institucional • CRP/CRO'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              RT
            </div>
          </div>
        </div>

        <RTStatsDashboard />
      </main>
    </div>
  );
}
