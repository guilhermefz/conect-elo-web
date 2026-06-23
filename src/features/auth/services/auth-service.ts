import api from "../../../lib/axios";

interface LoginDto {
  email: string;
  password: string;
}

interface RegistroDto {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginDto) => {
    const response = await api.post("/api/Autenticacao/Login", credentials);
    return response;
  },

  registro: async (dados: RegistroDto) => {
    const response = await api.post("/register", dados);
    return response;
  },
}