import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ReceptionStats } from '../components/ReceptionStats';
import { AppointmentTable } from '../components/AppointmentTable';
import { StudentDemandPanel } from '../components/StudentDemandPanel';
import { NewPatientModal } from '../components/NewPatientModal';
import { NewAppointmentModal } from '../components/NewAppointmentModal';
import {
  CalendarIcon,
  UserGroupIcon,
} from '../../../components/icons/CorporateIcons';

export function ReceptionDashboard() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      {/* Área Principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Cabeçalho da Página */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 mb-1 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Terminal de Recepção • Odontologia Integrada
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agenda Diária de Atendimentos Odontológicos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Clínica Odontológica UNINASSAU • Triagem e Gestão de Cadeiras
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">Coordenação de Odontologia</p>
            <p className="text-[10px] text-slate-500 font-mono">Supervisão: Profa. Dra. Bianca Nubia (CRO-SE 4512)</p>
          </div>
        </header>

        {/* Estatísticas */}
        <ReceptionStats />

        {/* Botões de Ação para Recepção */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <UserGroupIcon className="w-4 h-4" />
            <span>Novo Cadastro de Paciente (UC-03)</span>
          </button>
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Novo Agendamento Clínico (UC-02)</span>
          </button>
        </div>

        {/* Grid com Tabela e Demanda de Alunos */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AppointmentTable cursoFiltro="odontologia" />
          </div>
          <div className="lg:col-span-1">
            <StudentDemandPanel cursoFiltro="odontologia" />
          </div>
        </div>
      </main>

      {/* Modais Funcionais */}
      <NewPatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        defaultCourse="odontologia"
      />
      <NewAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        defaultCourse="odontologia"
      />
    </div>
  );
}