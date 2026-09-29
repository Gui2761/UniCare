import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../../services/api';

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
  custom?: boolean;
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
  allUsers: Record<string, User>;
  isAuthenticated: boolean;
  login: (presetKey: string) => Promise<void>;
  loginCustom: (user: User) => void;
  loginWithCredentials: (emailOuMatricula: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (presetKey: string) => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => string;
  updateUser: (key: string, updatedData: Partial<User>) => void;
  deleteUser: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'unicare_auth_user';
const ALL_USERS_STORAGE_KEY = 'unicare_all_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lista unificada de usuários (Presets + Criados Dinamicamente por Supervisores/RT)
  const [allUsers, setAllUsers] = useState<Record<string, User>>(() => {
    try {
      const stored = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...PRESET_USERS, ...parsed };
      }
    } catch {
      // Fallback para os presets institucionais
    }
    return PRESET_USERS;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return PRESET_USERS.estagiario_psico;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const syncBackendToken = async (matricula: string) => {
    try {
      await api.login(matricula, 'unicare123');
    } catch {
      // Backend em sincronização offline
    }
  };

  const login = async (presetKey: string) => {
    const selected = allUsers[presetKey] || PRESET_USERS[presetKey] || PRESET_USERS.estagiario_psico;
    setUser(selected);
    await syncBackendToken(selected.matricula);
  };

  const loginCustom = (newUser: User) => {
    setUser(newUser);
  };

  const createUser = (userData: Omit<User, 'id'>): string => {
    const cleanMatricula = userData.matricula.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const newKey = `usr_${cleanMatricula}_${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      ...userData,
      id: Date.now(),
      custom: true,
    };

    setAllUsers((prev) => {
      const updated = { ...prev, [newKey]: newUser };
      try {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Falha ao persistir usuários:', e);
      }
      return updated;
    });

    return newKey;
  };

  const updateUser = (key: string, updatedData: Partial<User>) => {
    setAllUsers((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      const updatedUser: User = { ...existing, ...updatedData };
      const updated = { ...prev, [key]: updatedUser };
      try {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Falha ao persistir atualização do usuário:', e);
      }
      if (user && (user.matricula === existing.matricula || user.id === existing.id)) {
        setUser(updatedUser);
      }
      return updated;
    });
  };

  const deleteUser = (key: string) => {
    setAllUsers((prev) => {
      const existing = prev[key];
      const updated = { ...prev };
      delete updated[key];
      try {
        localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Falha ao persistir remoção do usuário:', e);
      }
      if (user && existing && (user.matricula === existing.matricula || user.id === existing.id)) {
        setUser(PRESET_USERS.estagiario_psico);
      }
      return updated;
    });
  };

  const loginWithCredentials = async (emailOuMatricula: string, senha: string) => {
    try {
      const res = await api.login(emailOuMatricula, senha);
      const newUser: User = {
        id: Date.now(),
        nome: res.nome,
        email: emailOuMatricula.includes('@') ? emailOuMatricula : `${emailOuMatricula}@uninassau.edu.br`,
        perfil: res.perfil,
        curso: res.curso === 'geral' ? 'odontologia' : res.curso,
        matricula: res.matricula,
      };
      setUser(newUser);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Falha ao autenticar com o servidor.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    api.clearToken();
  };

  const switchUser = async (presetKey: string) => {
    await login(presetKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isAuthenticated: !!user,
        login,
        loginCustom,
        loginWithCredentials,
        logout,
        switchUser,
        createUser,
        updateUser,
        deleteUser,
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
