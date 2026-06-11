import React, { createContext, useContext, useState } from 'react';

import { apiClient } from '@/api/client';

export interface Usuario {
  usuario_id: number;
  nombre_completo: string;
  email: string;
  rol: 'GestorComedor' | 'Comerciante';
  comedor_id?: number;
  puesto_id?: number;
}

interface SessionContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<Usuario>;
  register: (nombre: string, email: string, password: string, rol: string) => Promise<Usuario>;
  logout: () => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<Usuario> => {
    setLoading(true);
    try {
      const response = await apiClient.post<Usuario>('/auth/login', { email, password });
      return new Promise<Usuario>((resolve) => {
        setUsuario(response.data);
        setTimeout(() => resolve(response.data), 0);
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre: string, email: string, password: string, rol: string): Promise<Usuario> => {
    setLoading(true);
    try {
      const response = await apiClient.post<Usuario>('/auth/register', {
        nombre_completo: nombre,
        email,
        password,
        rol,
      });
      return new Promise<Usuario>((resolve) => {
        setUsuario(response.data);
        setTimeout(() => resolve(response.data), 0);
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <SessionContext.Provider value={{ usuario, login, register, logout, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return context;
}
