import api from "../../../lib/axios";

export interface GrupoResumo {
  id: string;
  nome: string;
  muralId: string;
}

export async function buscarGruposDoUsuario(usuarioId: string) : Promise<GrupoResumo[]> {
  const response = await api.get(`/api/Grupo/BuscarPorUsuario/${usuarioId}`);
  return response.data.dados;
}
