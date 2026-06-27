import api from "../../../lib/axios"

export interface CriarAmigoSecretoPayload {
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  localizacao?: string;
  grupoId: string;
  dataSorteio?: string;
  valor: string;
}

export interface SorteioExecutadoResult {
  eventoId: string;
  dataExecucao: string;
  totalPares: number;
  participantesIds: string[];
}

export async function CriarAmigoSecreto(payload:CriarAmigoSecretoPayload): Promise<{ id: string }> {
  const response = await api.post("/api/Eventos/AmigoSecreto", payload)
  return { id: response.data.dados.id };
}

export async function sortearAgora(eventoId: string): Promise<SorteioExecutadoResult> {
  const response = await api.post(`/api/AmigoSecreto/${eventoId}/SortearAgora`);
  return response.data.dados;
}

export async function alterarDataSorteio(eventoId: string, novaData: string): Promise<{ jobId: string }> {
  const response = await api.put(`/api/AmigoSecreto/${eventoId}/AlterarData`, { novaData });
  return response.data.dados;
}