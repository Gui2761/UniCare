import { useState } from 'react';
import { PsySidebar } from '../../components/PsySidebar';
import { PsyReceptionStats } from '../components/PsyReceptionStats';
import { AppointmentTable } from '../../../reception/components/AppointmentTable';
import { StudentDemandPanel } from '../../../reception/components/StudentDemandPanel';
import { NewPatientModal } from '../../../reception/components/NewPatientModal';
import { NewAppointmentModal } from '../../../reception/components/NewAppointmentModal';
import {
  CalendarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '../../../../components/icons/CorporateIcons';

export function PsyReceptionDashboard() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <PsySidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Cabeçalho Superior Corporativo */}
        <header className="flex justify-between items-start mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-200/60 uppercase tracking-wider">
              SPA • Serviço de Psicologia Aplicada
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-700">
              Terminal de Recepção & Triagem
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60 font-mono">
            <span>UNINASSAU Saúde • Aracaju</span>
          </div>
        </header>

        {/* Título e Turnos */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Agenda da Recepção • Psicologia Clínica (SPA)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoramento de consultórios, acolhimento e fila de espera do SPA UNINASSAU
            </p>
          </div>
          <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
            <button className="px-3 py-1 text-slate-600 hover:text-slate-900 rounded-lg">
              Manhã
            </button>
            <button className="px-3 py-1 text-white bg-slate-900 rounded-lg shadow-xs">
              Tarde (Atual)
            </button>
            <button className="px-3 py-1 text-slate-600 hover:text-slate-900 rounded-lg">
              Noite
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mb-6 font-medium">
          Conformidade CFP nº 06/2019 • Gestão Operacional de Fluxo sem Acesso a Anotações Clínicas (RN-001)
        </p>

        {/* Estatísticas */}
        <PsyReceptionStats />

        {/* Barra de Ações Rápidas */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2.5">
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <UserGroupIcon className="w-4 h-4" />
              <span>Novo Cadastro SPA</span>
            </button>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <CalendarIcon className="w-4 h-4 text-slate-500" />
              <span>Agendar Sessão</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Triagem SPA Ativa • 34 em espera</span>
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
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <ShieldCheckIcon className="w-4 h-4 text-slate-700" />
                <span>Segurança e Sigilo no SPA</span>
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                As anotações confidenciais de psicoterapia são de acesso exclusivo do estagiário e do orientador docente (CRP).
              </p>
              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl text-[10px] text-slate-700 space-y-1 font-medium">
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