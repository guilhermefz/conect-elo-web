import api from "../../../lib/axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function buildFotoUrl(path: string): string {
  return `${API_URL}${path}?t=${Date.now()}`;
}

export interface PerfilDto {
  id: string;
  nome: string;
  email: string;
  bio: string;
  fotoPerfilUrl: string;
  dataNascimento: string;
  genero: number;
}

export interface AtualizarPerfilPayload {
  nome: string;
  email: string;
  bio: string;
  dataNascimento: string;
  genero: number;
}

export async function obterPerfil(): Promise<PerfilDto> {
  const response = await api.get("/api/Perfil/ObterPerfil");
  return response.data.dados;
}

export async function atualizarPerfil(payload: AtualizarPerfilPayload): Promise<PerfilDto> {
  const response = await api.put("/api/Perfil/AtualizarPerfil", payload);
  return response.data.dados;
}

export async function atualizarFoto(foto: File): Promise<string> {
  const formData = new FormData();
  formData.append("foto", foto);
  const response = await api.patch("/api/Perfil/AtualizaFoto", formData);
  return response.data.dados;
}
