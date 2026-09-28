import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoleType = 'estagiario' | 'supervisor' | 'recepcao' | 'rt';
export type CourseType = 'psicologia' | 'odontologia';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: RoleType;
  curso: CourseType;
  matricula: string;
  registro_profissional?: string;
}

export const PRESET_USERS: Record<string, User> = {
  recepcao: {
    id: 1,
    nome: 'Recepção Integrada Clínica',
    email: 'recepcao@uninassau.edu.br',
    perfil: 'recepcao',
    curso: 'odontologia',
    matricula: 'REC-2026-01',
    registro_profissional: 'ADM-SER-01',
  },
  estagiario_psico: {
    id: 2,
    nome: 'Rikelme Roma Santos',
    email: 'rikelmeroma13@gmail.com',
    perfil: 'estagiario',
    curso: 'psicologia',
    matricula: '16032935',
  },
  estagiario_odonto: {
    id: 3,
    nome: 'Augusto Cesar Farias Carvalho',
    email: 'augustocsar97@gmail.com',
    perfil: 'estagiario',
    curso: 'odontologia',
    matricula: '16024402',
  },
  supervisor_psico: {
    id: 4,
    nome: 'Prof. Dr. Robert Santos do Carmo',
    email: 'robert.carmo@uninassau.edu.br',
    perfil: 'supervisor',
    curso: 'psicologia',
    matricula: 'DOC-8821',
    registro_profissional: 'CRP 19/0844',
  },
  supervisor_odonto: {
    id: 5,
    nome: 'Profa. Dra. Bianca Nubia',
    email: 'bianca.silva@uninassau.edu.br',
    perfil: 'supervisor',
    curso: 'odontologia',
    matricula: 'DOC-9122',
    registro_profissional: 'CRO-SE 4512',
  },
  rt_master: {
    id: 6,
    nome: 'Dra. Camila (Referência Técnica Master)',
    email: 'camila.rt@uninassau.edu.br',
    perfil: 'rt',
    curso: 'psicologia',
    matricula: 'RT-001',
    registro_profissional: 'RT-CLINICA-GERAL',
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (presetKey: string) => void;
  loginCustom: (user: User) => void;
  logout: () => void;
  switchUser: (presetKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'unicare_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback para usuário inicial
    }
    // Usuário padrão inicial: Estagiário de Psicologia para demonstração imediata
    return PRESET_USERS.estagiario_psico;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (presetKey: string) => {
    const selected = PRESET_USERS[presetKey] || PRESET_USERS.estagiario_psico;
    setUser(selected);
  };

  const loginCustom = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchUser = (presetKey: string) => {
    login(presetKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginCustom,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
