import api from "../../../lib/axios"

export interface ExibirItemListaDesejos {
  id: string;
  descricao: string;
  urlReference?: string;
  reservadoPorId?: string;
}

export interface ExibirListaDesejos {
  id: string;
  titulo: string;
  itens: ExibirItemListaDesejos[];
}

export interface ExibirEvento {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  dataCriacao: string;
  localizacao?: string;
  status: number;
  tipoEvento: number;
  grupoId: string;
  criador: string;
  criadorNome?: string;
  fotoCapaUrl?: string;
  nomeAniversariante?: string;
  idade?: number;
  listaDesejos?: ExibirListaDesejos;
}

export interface CriarAniversarioPayload {
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  localizacao?: string;
  grupoId: string;
  nomeAniversariante: string;
  idade?: number;
  listaDesejos?: {
    titulo: string;
    itens: { descricao: string; urlReference?: string }[];
  };
}

export interface ExibirEventoResumo {
    id: string;
    titulo: string;
    descricao?: string;
    dataInicio?: string;
    localizacao?: string;
    tipoEvento: string | number;
    dataCriacao: string;
    fotoCapaUrl?: string;
    criadorNome?: string;
}

export async function CriarAniversario(payload:CriarAniversarioPayload): Promise<{ id: string }> {
    const response = await api.post("/api/Eventos/Aniversario", payload)
    return { id: response.data.dados.id };
}

export async function listarEventosPorGrupo(grupoId: string): Promise<ExibirEventoResumo[]> {
    const response = await api.get(`/api/Eventos/ListarPorGrupo/${grupoId}`);
    return response.data.dados ?? [];
}

export async function listarEventosDoUsuario(): Promise<ExibirEventoResumo[]> {
  const response = await api.get("/api/Eventos/ListarDoUsuario");
  return response.data.dados ?? [];
}

export async function buscarEventoPorId(id: string): Promise<ExibirEvento> {
  const response = await api.get(`/api/Eventos/BuscarPorId?id=${id}`);
  return response.data.dados;
}

export async function uploadFotoCapa(eventoId: string, foto: File): Promise<void> {
  const formData = new FormData();
  formData.append("foto", foto);
  await api.post(`/api/Eventos/FotoCapa/${eventoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
