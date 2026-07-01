import api from "../../../lib/axios";

export function buildFotoUrl(path: string): string {
  return path;
}

export interface Interesse {
  id: string;
  nome: string;
}

export interface PerfilDto {
  id: string;
  nome: string;
  email: string;
  bio: string;
  fotoPerfilUrl: string;
  dataNascimento: string;
  genero: number;
  interesses: Interesse[];
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

export async function obterInteressesDisponiveis(): Promise<Interesse[]> {
  const response = await api.get("/api/Perfil/InteressesDisponiveis");
  return response.data.dados;
}

export async function atualizarInteresses(interesseIds: string[]): Promise<Interesse[]> {
  const response = await api.put("/api/Perfil/AtualizarInteresses", { interesseIds });
  return response.data.dados;
}

export async function atualizarFoto(foto: File): Promise<string> {
  const formData = new FormData();
  formData.append("foto", foto);
  const response = await api.patch("/api/Perfil/AtualizaFoto", formData);
  return response.data.dados;
}
