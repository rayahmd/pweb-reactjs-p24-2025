import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getProfile,
} from "../services/authService";
import type { AuthResponse, LoginPayload, RegisterPayload, User, UserResponse } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<UserResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [token]);

  const persistAuth = (auth: AuthResponse) => {
    localStorage.setItem("token", auth.data.token);
    setToken(auth.data.token);
    return auth;
  };

  const handleLogin = async (payload: LoginPayload) => {
    const auth = await loginRequest(payload);
    const persistedAuth = persistAuth(auth);
    // Fetch user profile after login
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
    return persistedAuth;
  };

  const handleRegister = async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    setUser(response.data);
    return response;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isInitializing,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [user, token, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
