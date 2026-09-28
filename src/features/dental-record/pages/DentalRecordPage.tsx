import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PatientHeader } from '../components/PatientHeader';
import OdontogramApp from '../components/OdontogramaViewer';
import Periodograma from '../components/PeriodogramaViewer';
import { DentalEvolutionTab } from '../components/DentalEvolutionTab';
import { TreatmentPlanTab } from '../components/TreatmentPlanTab';

export function DentalRecordPage() {
  const [activeTab, setActiveTab] = useState<'anamnese' | 'evolucao' | 'tratamento'>('anamnese');

  const getTabStyle = (tabName: 'anamnese' | 'evolucao' | 'tratamento') => {
    return `px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
      activeTab === tabName
        ? 'text-blue-600 border-blue-600 bg-blue-50/30'
        : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <span>Módulos Clínicos</span>
          <span>/</span>
          <span className="text-blue-600 font-bold">Ficha Odontológica</span>
          <span>/</span>
          <span>Prontuário Eletrônico #0884/26</span>
        </div>

        <PatientHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Esquerda: Alertas Clínicos & Sinais Vitais */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="text-red-500">⚠️</span> Alertas Clínicos (Destaque Vermelho)
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 font-medium">
                  <strong>Alergia Medicamentosa:</strong> Penicilina e derivados.
                </li>
                <li className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 font-medium">
                  <strong>Hipertensão Arterial:</strong> Controlada (Losartana 50mg).
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span>❤️</span> Sinais Vitais da Sessão
              </h3>
              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Pressão Arterial (P.A.)</span>
                  <span className="font-bold text-gray-900">120/80 mmHg</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Glicemia Capilar</span>
                  <span className="font-bold text-gray-900">98 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Frequência Cardíaca</span>
                  <span className="font-bold text-gray-900">74 bpm</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1">
              <p className="font-bold">Regra Institucional CFO:</p>
              <p className="text-[11px] leading-relaxed">
                Atendimento clínico em cadeira deve ser conduzido obrigatoriamente por dupla (Operador e Auxiliar) sob supervisão de docente alocado.
              </p>
            </div>
          </div>

          {/* Área Principal (Abas e Conteúdo) */}
          <div className="lg:col-span-9">
            {/* Menu de Abas */}
            <div className="bg-white px-4 pt-1 rounded-xl border border-gray-200 shadow-sm mb-6 flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('anamnese')}
                className={getTabStyle('anamnese')}
              >
                <span>🦷</span> Odontograma & Periodograma
              </button>
              <button
                onClick={() => setActiveTab('evolucao')}
                className={getTabStyle('evolucao')}
              >
                <span>📝</span> Evolução Clínica Diária
              </button>
              <button
                onClick={() => setActiveTab('tratamento')}
                className={getTabStyle('tratamento')}
              >
                <span>📋</span> Plano de Tratamento
              </button>
            </div>

            {/* Conteúdo Renderizado Condicionalmente */}
            {activeTab === 'anamnese' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <OdontogramApp />
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <Periodograma />
                </div>
              </div>
            )}

            {activeTab === 'evolucao' && (
              <DentalEvolutionTab />
            )}

            {activeTab === 'tratamento' && (
              <TreatmentPlanTab />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}