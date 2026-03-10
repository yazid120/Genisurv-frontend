import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../@types/user";
import { loginApi, type LoginPayload } from "../api/auth.api";
import { registerApi, type RegisterPayload } from "../api/auth.api";
import { logoutApi, meApi } from "../api/auth.api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Fetch current user on mount (if token exists)
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await meApi();
        setUser(response.data.user);
      } catch {
        // Token is invalid or expired
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginApi(payload);
    const { token: newToken, user: loggedInUser } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerApi(payload);
    const { token: newToken, user: registeredUser } = response.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
