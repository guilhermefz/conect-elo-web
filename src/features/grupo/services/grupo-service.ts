import api from "../../../lib/axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function buildFotoGrupoUrl(path: string): string {
  return `${API_URL}${path}?t=${Date.now()}`;
}

export interface GrupoResumo {
  id: string;
  nome: string;
  muralId: string;
  imgGrupo?: string;
}

export async function buscarGruposDoUsuario(usuarioId: string): Promise<GrupoResumo[]> {
  const response = await api.get(`/api/Grupo/BuscarPorUsuario/${usuarioId}`);
  return response.data.dados;
}

export interface CriarGrupoPayload {
  nome: string;
  descricao: string;
  privado: boolean;
  proprietarioId: string;
  imgGrupo?: string;
}

export async function criarGrupo(payload: CriarGrupoPayload): Promise<void> {
  await api.post("/api/Grupo/Salvar", payload);
}

export interface MembroGrupoExibicao {
  usuarioId: string;
  nomeUsuario: string;
  dataEntrada: string;
  tipo: number;
}

export interface GrupoDetalhes {
  id: string;
  nome: string;
  descricao: string;
  codigoConvite?: string;
  dataCriacao: string;
  imgGrupo?: string;
  privado: boolean;
  proprietarioId: string;
  muralId: string;
  membros: MembroGrupoExibicao[];
}

export async function obterGrupoPorId(id: string): Promise<GrupoDetalhes> {
  const response = await api.get(`/api/Grupo/Buscar`, { params: { id } });
  return response.data.dados;
}

export interface AtualizarGrupoPayload {
  nome: string;
  descricao: string;
  privado: boolean;
  imgGrupo?: string;
}

export async function atualizarGrupo(id: string, payload: AtualizarGrupoPayload): Promise<void> {
  await api.post("/api/Grupo/Editar", { id, ...payload });
}

export async function atualizarFotoGrupo(grupoId: string, foto: File): Promise<string> {
  const formData = new FormData();
  formData.append("foto", foto);
  const response = await api.patch(`/api/Grupo/${grupoId}/AtualizarFoto`, formData);
  return response.data.dados;
}

export async function entrarPorConvite(codigo: string) : Promise<GrupoResumo> {
  const response = await api.post(`/api/Grupo/EntrarPorConvite/${codigo}`);
  return response.data.dados;
}
