import React, { createContext, useContext, useState, useEffect } from 'react';

export type StatusAgendamento = 'AGENDADO' | 'PRESENTE' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'FALTOU' | 'CANCELADO';
export type StatusProntuario = 'EM_ELABORACAO' | 'AGUARDANDO_VALIDACAO' | 'VALIDADO' | 'DEVOLVIDO_PARA_AJUSTE';

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  ehMenor: boolean;
  nomeResponsavel?: string;
  contatoResponsavel?: string;
  curso: 'psicologia' | 'odontologia' | 'ambos';
  prontuarioAtivo: boolean;
}

export interface Agendamento {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  estagiarioNome: string;
  estagiarioMatricula: string;
  curso: 'psicologia' | 'odontologia';
  horario: string; // Ex: '14:00'
  turno: 'manha' | 'tarde' | 'noite';
  salaOuCadeira: string; // Ex: 'Sala 03' ou 'Cadeira 04'
  tipoConsulta: string; // Ex: 'Psicoterapia Adulto' ou 'Restauração Resina'
  status: StatusAgendamento;
  observacaoLogistica?: string;
}

export interface DemandaEstagio {
  id: number;
  alunoNome: string;
  alunoMatricula: string;
  curso: 'psicologia' | 'odontologia';
  procedimentoDesejado: string;
  prioridade: 'Alta' | 'Média' | 'Normal';
  dataSolicitacao: string;
  status: 'Pendente' | 'Agendado';
}

export interface EvolucaoPsico {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  estagiarioNome: string;
  estagiarioMatricula: string;
  supervisorNome: string;
  dataSessao: string;
  numeroSessao: string;
  inicioTexto: string;
  meioTexto: string;
  fimTexto: string;
  parecerSupervisor?: string;
  status: StatusProntuario;
  submetidoEm: string;
}

export interface ItemPlanoTratamento {
  id: number;
  prioridade: 'Urgência' | 'Fase 1 - Restauradora' | 'Fase 2 - Periodontal' | 'Fase 3 - Manutenção';
  denteRegiao: string;
  procedimento: string;
  status: 'Concluído' | 'Em Andamento' | 'Planejado';
  estagiarioResponsavel: string;
}

interface ClinicContextType {
  pacientes: Paciente[];
  agendamentos: Agendamento[];
  demandas: DemandaEstagio[];
  evolucoesPsico: EvolucaoPsico[];
  planosTratamento: ItemPlanoTratamento[];
  cadastrarPaciente: (p: Omit<Paciente, 'id' | 'prontuarioAtivo'>) => { success: boolean; message: string; paciente?: Paciente };
  adicionarAgendamento: (a: Omit<Agendamento, 'id'>) => void;
  atualizarStatusAgendamento: (id: number, status: StatusAgendamento) => void;
  adicionarDemanda: (d: Omit<DemandaEstagio, 'id' | 'status' | 'dataSolicitacao'>) => void;
  homologarEvolucaoPsico: (id: number, decisao: 'VALIDADO' | 'DEVOLVIDO_PARA_AJUSTE', parecer: string) => void;
  adicionarEvolucaoPsico: (e: Omit<EvolucaoPsico, 'id' | 'status' | 'submetidoEm'>) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const INITIAL_PACIENTES: Paciente[] = [
  {
    id: 1,
    nome: 'Marcos Aurélio Silveira',
    cpf: '048.291.545-88',
    dataNascimento: '1998-08-14',
    telefone: '(79) 99841-2299',
    ehMenor: false,
    curso: 'psicologia',
    prontuarioAtivo: true,
  },
  {
    id: 2,
    nome: 'Carlos Silva e Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1984-05-12',
    telefone: '(79) 98821-3312',
    ehMenor: false,
    curso: 'odontologia',
    prontuarioAtivo: true,
  },
  {
    id: 3,
    nome: 'Juliana Ferreira Oliveira',
    cpf: '789.123.456-11',
    dataNascimento: '2003-11-20',
    telefone: '(79) 99122-4455',
    ehMenor: false,
    curso: 'ambos',
    prontuarioAtivo: true,
  },
  {
    id: 4,
    nome: 'Lucas Gabriel Menezes (Menor)',
    cpf: '882.114.992-30',
    dataNascimento: '2016-04-10',
    telefone: '(79) 98711-0022',
    ehMenor: true,
    nomeResponsavel: 'Mariana Menezes (Mãe)',
    contatoResponsavel: '(79) 98711-0022',
    curso: 'odontologia',
    prontuarioAtivo: true,
  },
];

const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 1,
    pacienteId: 1,
    pacienteNome: 'Marcos Aurélio Silveira',
    estagiarioNome: 'Rikelme Roma Santos',
    estagiarioMatricula: '16032935',
    curso: 'psicologia',
    horario: '14:00',
    turno: 'tarde',
    salaOuCadeira: 'Consultório SPA-02',
    tipoConsulta: 'Psicoterapia Cognitivo-Comportamental',
    status: 'PRESENTE',
    observacaoLogistica: 'Aguardando na recepção pontual',
  },
  {
    id: 2,
    pacienteId: 3,
    pacienteNome: 'Juliana Ferreira Oliveira',
    estagiarioNome: 'João Kaio Rodrigues',
    estagiarioMatricula: '16031730',
    curso: 'psicologia',
    horario: '15:00',
    turno: 'tarde',
    salaOuCadeira: 'Consultório SPA-04',
    tipoConsulta: 'Avaliação Psicológica Vocacional',
    status: 'AGENDADO',
    observacaoLogistica: 'Confirmou presença por WhatsApp',
  },
  {
    id: 3,
    pacienteId: 2,
    pacienteNome: 'Carlos Silva e Santos',
    estagiarioNome: 'Augusto Cesar Farias & Gabriela Prado',
    estagiarioMatricula: '16024402',
    curso: 'odontologia',
    horario: '14:00',
    turno: 'tarde',
    salaOuCadeira: 'Cadeira Odonto 04',
    tipoConsulta: 'Restauração Resina Dente 36 (Classe II)',
    status: 'EM_ATENDIMENTO',
    observacaoLogistica: 'Alerta de Alergia a Penicilina conferido',
  },
  {
    id: 4,
    pacienteId: 4,
    pacienteNome: 'Lucas Gabriel Menezes (Menor)',
    estagiarioNome: 'Marlon Bruno dos Santos',
    estagiarioMatricula: '16032601',
    curso: 'odontologia',
    horario: '15:30',
    turno: 'tarde',
    salaOuCadeira: 'Cadeira Odonto 02 (Odontopediatria)',
    tipoConsulta: 'Aplicação de Selante Dente 16',
    status: 'AGENDADO',
    observacaoLogistica: 'Acompanhado pela responsável legal',
  },
  {
    id: 5,
    pacienteId: 1,
    pacienteNome: 'Beatriz Almeida Costa',
    estagiarioNome: 'Rikelme Roma Santos',
    estagiarioMatricula: '16032935',
    curso: 'psicologia',
    horario: '16:00',
    turno: 'tarde',
    salaOuCadeira: 'Consultório SPA-01',
    tipoConsulta: 'Acolhimento Inicial / Triagem',
    status: 'FALTOU',
    observacaoLogistica: 'Paciente justificou ausência por motivo de trabalho',
  },
];

const INITIAL_DEMANDAS: DemandaEstagio[] = [
  {
    id: 1,
    alunoNome: 'Augusto Cesar Farias (Odonto)',
    alunoMatricula: '16024402',
    curso: 'odontologia',
    procedimentoDesejado: '1 paciente para raspagem supra e subgengival (Periodontia)',
    prioridade: 'Alta',
    dataSolicitacao: '15/09/2026',
    status: 'Pendente',
  },
  {
    id: 2,
    alunoNome: 'Rikelme Roma Santos (Psico)',
    alunoMatricula: '16032935',
    curso: 'psicologia',
    procedimentoDesejado: '1 paciente adulto para avaliação TCC (Sessão inicial)',
    prioridade: 'Média',
    dataSolicitacao: '15/09/2026',
    status: 'Pendente',
  },
  {
    id: 3,
    alunoNome: 'Marlon Bruno dos Santos (Odonto)',
    alunoMatricula: '16032601',
    curso: 'odontologia',
    procedimentoDesejado: '1 paciente infantil para profilaxia e aplicação de flúor',
    prioridade: 'Normal',
    dataSolicitacao: '14/09/2026',
    status: 'Agendado',
  },
];

const INITIAL_EVOLUCOES: EvolucaoPsico[] = [
  {
    id: 1,
    pacienteId: 1,
    pacienteNome: 'Marcos Aurélio Silveira',
    estagiarioNome: 'Rikelme Roma Santos',
    estagiarioMatricula: '16032935',
    supervisorNome: 'Prof. Dr. Robert Santos do Carmo',
    dataSessao: '15/09/2026',
    numeroSessao: 'Sessão 04',
    inicioTexto: 'Acolhimento pontual e receptivo. Paciente relata persistência dos gatilhos de sobrecarga com avaliações acadêmicas.',
    meioTexto: 'Aplicação da técnica de questionamento socrático sobre catastrofização. Paciente identificou padrões de autoexigência com flexibilização cognitiva orientada.',
    fimTexto: 'Pactuado automonitoramento diário de pensamentos disfuncionais (RPD). Sem risco autolesivo ou queixas agudas.',
    status: 'AGUARDANDO_VALIDACAO',
    submetidoEm: '15/09/2026 14:52',
  },
  {
    id: 2,
    pacienteId: 3,
    pacienteNome: 'Juliana Ferreira Oliveira',
    estagiarioNome: 'João Kaio Rodrigues',
    estagiarioMatricula: '16031730',
    supervisorNome: 'Prof. Dr. Robert Santos do Carmo',
    dataSessao: '14/09/2026',
    numeroSessao: 'Sessão 02',
    inicioTexto: 'Sessão iniciada no horário. Acolhimento e validação dos sentimentos relativos à escolha profissional.',
    meioTexto: 'Aplicação da primeira bateria do questionário de interesses ocupacionais. Boa compreensão das instruções e colaboração ativa.',
    fimTexto: 'Encerramento com agendamento da aplicação da escala complementar na sessão seguinte.',
    parecerSupervisor: 'Excelente condução técnica e síntese clínica sem transcrições literais. Aprovado com visto digital.',
    status: 'VALIDADO',
    submetidoEm: '14/09/2026 16:30',
  },
];

const INITIAL_PLANOS: ItemPlanoTratamento[] = [
  {
    id: 1,
    prioridade: 'Urgência',
    denteRegiao: 'Dente 36',
    procedimento: 'Restauração profunda em resina composta (Classe II MOD)',
    status: 'Concluído',
    estagiarioResponsavel: 'Lucas Vasconcelos & Gabriela Prado',
  },
  {
    id: 2,
    prioridade: 'Fase 1 - Restauradora',
    denteRegiao: 'Dente 16',
    procedimento: 'Remoção de cárie oclusal e selante invasivo',
    status: 'Em Andamento',
    estagiarioResponsavel: 'Augusto Cesar Farias & Gabriela Prado',
  },
  {
    id: 3,
    prioridade: 'Fase 2 - Periodontal',
    denteRegiao: 'Sextante Ântero-Inferior (33 ao 43)',
    procedimento: 'Raspagem supra e alisamento coronário',
    status: 'Planejado',
    estagiarioResponsavel: 'Augusto Cesar Farias',
  },
  {
    id: 4,
    prioridade: 'Fase 3 - Manutenção',
    denteRegiao: 'Arcada Completa',
    procedimento: 'Profilaxia com pasta profilática e aplicação tópica de flúor',
    status: 'Planejado',
    estagiarioResponsavel: 'Augusto Cesar Farias',
  },
];

const STORAGE_PREFIX = 'unicare_clinic_';

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + 'pacientes');
      return stored ? JSON.parse(stored) : INITIAL_PACIENTES;
    } catch {
      return INITIAL_PACIENTES;
    }
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + 'agendamentos');
      return stored ? JSON.parse(stored) : INITIAL_AGENDAMENTOS;
    } catch {
      return INITIAL_AGENDAMENTOS;
    }
  });

  const [demandas, setDemandas] = useState<DemandaEstagio[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + 'demandas');
      return stored ? JSON.parse(stored) : INITIAL_DEMANDAS;
    } catch {
      return INITIAL_DEMANDAS;
    }
  });

  const [evolucoesPsico, setEvolucoesPsico] = useState<EvolucaoPsico[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + 'evolucoes');
      return stored ? JSON.parse(stored) : INITIAL_EVOLUCOES;
    } catch {
      return INITIAL_EVOLUCOES;
    }
  });

  const [planosTratamento] = useState<ItemPlanoTratamento[]>(INITIAL_PLANOS);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'demandas', JSON.stringify(demandas));
  }, [demandas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'evolucoes', JSON.stringify(evolucoesPsico));
  }, [evolucoesPsico]);

  const cadastrarPaciente = (dados: Omit<Paciente, 'id' | 'prontuarioAtivo'>) => {
    // Validação de CPF duplicado (RF-007)
    const limpaCpf = (c: string) => c.replace(/\D/g, '');
    const jaExiste = pacientes.some((p) => limpaCpf(p.cpf) === limpaCpf(dados.cpf));

    if (jaExiste) {
      return { success: false, message: 'Já existe um paciente cadastrado com este número de CPF!' };
    }

    if (dados.ehMenor && (!dados.nomeResponsavel || !dados.contatoResponsavel)) {
      return { success: false, message: 'Para pacientes menores de idade, é obrigatório registrar o Responsável Legal e Contato!' };
    }

    const novoPaciente: Paciente = {
      ...dados,
      id: Date.now(),
      prontuarioAtivo: true,
    };

    setPacientes((prev) => [novoPaciente, ...prev]);
    return { success: true, message: 'Paciente cadastrado com sucesso!', paciente: novoPaciente };
  };

  const adicionarAgendamento = (novo: Omit<Agendamento, 'id'>) => {
    const ag: Agendamento = {
      ...novo,
      id: Date.now(),
    };
    setAgendamentos((prev) => [ag, ...prev]);
  };

  const atualizarStatusAgendamento = (id: number, status: StatusAgendamento) => {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const adicionarDemanda = (d: Omit<DemandaEstagio, 'id' | 'status' | 'dataSolicitacao'>) => {
    const dem: DemandaEstagio = {
      ...d,
      id: Date.now(),
      status: 'Pendente',
      dataSolicitacao: new Date().toLocaleDateString('pt-BR'),
    };
    setDemandas((prev) => [dem, ...prev]);
  };

  const homologarEvolucaoPsico = (id: number, decisao: 'VALIDADO' | 'DEVOLVIDO_PARA_AJUSTE', parecer: string) => {
    setEvolucoesPsico((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: decisao, parecerSupervisor: parecer } : e))
    );
  };

  const adicionarEvolucaoPsico = (e: Omit<EvolucaoPsico, 'id' | 'status' | 'submetidoEm'>) => {
    const nova: EvolucaoPsico = {
      ...e,
      id: Date.now(),
      status: 'AGARDANDO_VALIDACAO' as unknown as StatusProntuario,
      submetidoEm: new Date().toLocaleString('pt-BR'),
    };
    setEvolucoesPsico((prev) => [nova, ...prev]);
  };

  return (
    <ClinicContext.Provider
      value={{
        pacientes,
        agendamentos,
        demandas,
        evolucoesPsico,
        planosTratamento,
        cadastrarPaciente,
        adicionarAgendamento,
        atualizarStatusAgendamento,
        adicionarDemanda,
        homologarEvolucaoPsico,
        adicionarEvolucaoPsico,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic deve ser utilizado dentro de um ClinicProvider');
  }
  return context;
}
