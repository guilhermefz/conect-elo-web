import api from "../../../lib/axios"

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
}
    
export async function CriarAniversario(payload:CriarAniversarioPayload): Promise<void> {
    await api.post("/api/Eventos/Aniversario", payload)
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
