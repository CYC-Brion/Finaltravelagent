import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthSession, LoginInput } from "@/domain/types";
import { travelApi } from "@/lib/api/travelApi";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: LoginInput) => Promise<AuthSession>;
  logout: () => void;
}

const STORAGE_KEY = "helloworld.session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setSession(JSON.parse(raw) as AuthSession);
    }
    setLoading(false);
  }, []);

  const persist = (nextSession: AuthSession | null) => {
    setSession(nextSession);
    if (nextSession) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      login: async (input) => {
        const nextSession = await travelApi.login(input);
        persist(nextSession);
        return nextSession;
      },
      register: async (input) => {
        const nextSession = await travelApi.register(input);
        persist(nextSession);
        return nextSession;
      },
      logout: () => persist(null),
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
