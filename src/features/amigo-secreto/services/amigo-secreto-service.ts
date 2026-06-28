import api from "../../../lib/axios"
import { type ExibirListaDesejos } from "../../eventos/services/evento-service"

export interface CriarAmigoSecretoPayload {
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  localizacao?: string;
  grupoId: string;
  dataSorteio?: string;
  valor: string;
}

export interface SorteioExecutado {
  eventoId: string;
  dataExecucao: string;
  totalPares: number;
  participantesIds: string[];
}

export async function CriarAmigoSecreto(payload:CriarAmigoSecretoPayload): Promise<{ id: string }> {
  const response = await api.post("/api/Eventos/AmigoSecreto", payload)
  return { id: response.data.dados.id };
}

export async function sortear(eventoId: string): Promise<SorteioExecutado> {
  const response = await api.post(`/api/AmigoSecreto/${eventoId}/Sortear`);
  return response.data.dados;
}

export interface ResultadoComoPresenteador {
  resultadoSorteioId: string;
  nomeRecebedor: string;
  fotoRecebedor?: string;
  listaDesejos?: ExibirListaDesejos;
}

export interface ResultadoComoRecebedor {
  resultadoSorteioId: string;
}

export interface MeuResultado {
  comoPresenteador?: ResultadoComoPresenteador | null;
  comoRecebedor?: ResultadoComoRecebedor | null;
}

export async function buscarMeuResultado(eventoId: string): Promise<MeuResultado> {
  const response = await api.get(`/api/AmigoSecreto/${eventoId}/MeuResultado`);
  return response.data.dados;
}