import { useState } from 'react';
import { PsySidebar } from '../../components/PsySidebar';
import { PsyReceptionStats } from '../components/PsyReceptionStats';
import { AppointmentTable } from '../../../reception/components/AppointmentTable';
import { StudentDemandPanel } from '../../../reception/components/StudentDemandPanel';
import { NewPatientModal } from '../../../reception/components/NewPatientModal';
import { NewAppointmentModal } from '../../../reception/components/NewAppointmentModal';

export function PsyReceptionDashboard() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Cabeçalho Superior - Tags SPA */}
        <header className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded">
              SPA • SERVIÇO DE PSICOLOGIA APLICADA
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded">
              TERMINAL RECEPÇÃO SPA-01
            </span>
          </div>
          <div className="text-right flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100">
              <span className="text-blue-600">🕒</span>
              <span className="font-bold text-gray-900 text-sm">15:59:38</span>
              <span className="text-xs text-gray-500">Terça-feira, 15 de Setembro de 2026</span>
            </div>
          </div>
        </header>

        {/* Título e Turnos */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda Diária da Recepção • Psicologia</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoramento de consultórios, acolhimento e fila de espera do SPA UNINASSAU
            </p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg text-xs">
            <button className="px-3 py-1.5 font-medium text-gray-600 hover:bg-white rounded">
              Manhã (07h - 12h)
            </button>
            <button className="px-3 py-1.5 font-bold text-white bg-[#0a1526] rounded shadow-sm">
              Tarde (13h - 18h) • Atual
            </button>
            <button className="px-3 py-1.5 font-medium text-gray-600 hover:bg-white rounded">
              Noite (18h - 22h)
            </button>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mb-6 font-medium">
          ⚖️ Resolução CFP nº 06/2019 • Gestão Operacional de Fluxo sem Acesso a Anotações Clínicas (RN-001)
        </p>

        {/* Estatísticas */}
        <PsyReceptionStats />

        {/* Barra de Ações Rápidas */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="bg-[#0056b3] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>👤+</span> Novo Cadastro SPA
            </button>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>📅+</span> Agendar Sessão / Retorno
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            <span>⏳</span> <strong>Fila de Espera SPA:</strong> 34 pacientes aguardando triagem
          </div>
        </div>

        {/* Layout Grid (Tabela Esquerda + Painéis Direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <AppointmentTable cursoFiltro="psicologia" />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <StudentDemandPanel cursoFiltro="psicologia" />

            {/* Painel Informativo de Ética e Sigilo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-xs space-y-3">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                <span>🛡️</span> Segurança e Ética no SPA
              </h4>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                As anotações confidenciais de psicoterapia são de acesso exclusivo do estagiário e do professor orientador (CRP).
              </p>
              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-[10px] text-blue-800 space-y-1">
                <p>• <strong>Resolução CFP 06/2019:</strong> Vedação de citações diretas.</p>
                <p>• <strong>Art. 11 LGPD:</strong> Tratamento de dados sensíveis de saúde.</p>
                <p>• <strong>Custódia:</strong> Referência Técnica Dra. Camila.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modais Funcionais */}
      <NewPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        defaultCourse="psicologia"
      />
      <NewAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        defaultCourse="psicologia"
      />
    </div>
  );
}