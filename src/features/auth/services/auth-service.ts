import api from "../../../lib/axios";

interface LoginDto {
  email: string;
  password: string;
}

interface RegistroDto {
  nome: string;
  email: string;
  password: string;
  dataNascimento: string;
  genero: number;
  cpf: null;
  bio: null;
}

export const authService = {
  login: async (credentials: LoginDto) => {
    const response = await api.post("/api/Autenticacao/Login", credentials);
    return response;
  },

  registro: async (dados: RegistroDto) => {
    const response = await api.post("/api/Usuario/Salvar", dados);
    return response;
  },
}