import api from "../../../lib/axios"

export interface ConfirmacaoMembro {
  usuarioId: string;
  nome: string;
  fotoPerfil?: string;
  status: number;
}

export interface ConfirmacoesEvento {
  minhaConfirmacao: number | null;
  confirmacoes: ConfirmacaoMembro[];
}

export interface ExibirItemListaDesejos {
  id: string;
  descricao: string;
  urlReference?: string;
  reservadoPorId?: string;
  reservadoPorNome?: string;
  reservadoPorFoto?: string;
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
    participacaoUsuario?: number | null;
}

export interface EditarEventoPayload {
  id: string;
  titulo: string;
  idade?: number;
  descricao?: string;
  dataInicio?: string;
  localizacao?: string;
  status: number;
  tipoEvento: number;
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

export async function registrarParticipacao(eventoId: string, status: number): Promise<void> {
  await api.post(`/api/Eventos/${eventoId}/Participacao`, { status });
}

export async function listarConfirmacoes(eventoId: string): Promise<ConfirmacoesEvento> {
  const response = await api.get(`/api/Eventos/${eventoId}/Confirmacoes`);
  return response.data.dados;
}

export async function selecionarItemListaDesejos(itemId: string): Promise<ExibirItemListaDesejos> {
  const response = await api.put(`/api/Eventos/ListaDesejos/Selecionar/${itemId}`);
  return response.data.dados;
}

export async function desselecionarItemListaDesejos(itemId: string): Promise<ExibirItemListaDesejos> {
  const response = await api.delete(`/api/Eventos/ListaDesejos/Selecionar/${itemId}`);
  return response.data.dados;
}

export async function adicionarItemListaDesejos( listaId: string, payload: { descricao: string; urlReference?: string }): Promise<ExibirItemListaDesejos> {
  const response = await api.post(`/api/Eventos/ListaDesejos/${listaId}/Itens`, payload);
  return response.data.dados;
}

export async function removerItemListaDesejos(itemId: string): Promise<void> {
  await api.delete(`/api/Eventos/ListaDesejos/Itens/${itemId}`);
}

export async function editarEvento(payload: EditarEventoPayload): Promise<void> {
  await api.put("/api/Eventos/Editar", payload);
}
