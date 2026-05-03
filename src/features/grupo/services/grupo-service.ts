import api from "../../../lib/axios";

export interface GrupoResumo {
  id: string;
  nome: string;
  muralId: string;
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
