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

interface GoogleAuthResponse extends Usuario {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
}

interface SessionContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<Usuario>;
  register: (nombre: string, email: string, password: string, rol: string, latitud?: number, longitud?: number) => Promise<Usuario>;
  loginWithGoogle: (idToken: string, rol: string) => Promise<Usuario & { is_new_user: boolean }>;
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

  const register = async (nombre: string, email: string, password: string, rol: string, latitud?: number, longitud?: number): Promise<Usuario> => {
    setLoading(true);
    try {
      const response = await apiClient.post<Usuario>('/auth/register', {
        nombre_completo: nombre,
        email,
        password,
        rol,
        latitud,
        longitud,
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

  const loginWithGoogle = async (idToken: string, rol: string): Promise<Usuario & { is_new_user: boolean }> => {
    setLoading(true);
    try {
      const response = await apiClient.post<GoogleAuthResponse>('/auth/google', {
        id_token: idToken,
        rol,
      });
      const { access_token: _, ...rest } = response.data;
      return new Promise<Usuario & { is_new_user: boolean }>((resolve) => {
        setUsuario(rest);
        setTimeout(() => resolve(rest), 0);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ usuario, login, register, loginWithGoogle, logout, loading }}>
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
