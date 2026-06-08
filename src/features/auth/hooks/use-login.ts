import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-service";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    setErro(null);
    try {
      const response = await authService.login(data);
      const token = response.data?.dados?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/home");
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, erro };
}
