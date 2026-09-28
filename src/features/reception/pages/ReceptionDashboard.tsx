import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ReceptionStats } from '../components/ReceptionStats';
import { AppointmentTable } from '../components/AppointmentTable';
import { StudentDemandPanel } from '../components/StudentDemandPanel';
import { NewPatientModal } from '../components/NewPatientModal';
import { NewAppointmentModal } from '../components/NewAppointmentModal';

export function ReceptionDashboard() {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <Sidebar />

      {/* Área Principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Cabeçalho da Página */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Terminal de Recepção Integrada • Odontologia
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda Diária da Recepção</h1>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span>📅 Terça-feira, 15 de Setembro de 2026</span>
              <span className="text-gray-300">|</span>
              <span>Horário Atual: 14:57:18</span>
              <span className="text-gray-300">|</span>
              <span className="text-blue-600 font-bold">Clínica Odontológica UNINASSAU</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Coordenação de Odontologia</p>
            <p className="text-xs text-gray-500">Profa. Dra. Bianca Nubia (CRO-SE 4512)</p>
          </div>
        </header>

        {/* Estatísticas */}
        <ReceptionStats />

        {/* Botões de Ação para Recepção */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="bg-[#0a1526] hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <span>👤+</span> Novo Cadastro de Paciente (UC-03)
          </button>
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="bg-[#0056b3] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <span>📅+</span> Novo Agendamento Clínico (UC-02)
          </button>
        </div>

        {/* Layout Grid: Tabela de Atendimentos + Painel de Demandas de Alunos */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <AppointmentTable cursoFiltro="odontologia" />
          </div>
          <div className="xl:col-span-1 space-y-6">
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