import api from "../../../lib/axios"
import { type ExibirListaDesejos, type ExibirItemListaDesejos } from "../../eventos/services/evento-service"

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

export interface AdicionarItemPayload {
  descricao: string;
  urlReference?: string;
}

export async function buscarMinhaLista(eventoId: string): Promise<ExibirListaDesejos> {
  const response = await api.get(`/api/AmigoSecreto/${eventoId}/MinhaLista`);
  return response.data.dados;
}

export async function adicionarItemMinhaLista(
  eventoId: string,
  payload: AdicionarItemPayload,
): Promise<ExibirItemListaDesejos> {
  const response = await api.post(`/api/AmigoSecreto/${eventoId}/MinhaLista/Itens`, payload);
  return response.data.dados;
}

export async function removerItemMinhaLista(itemId: string): Promise<void> {
  await api.delete(`/api/AmigoSecreto/ListaDesejos/Itens/${itemId}`);
}

// ─────────────────────────── Detalhe + Quiz ───────────────────────────

export interface OpcaoQuiz {
  id: string;
  emoji?: string;
  texto: string;
  ordem: number;
}

export interface PerguntaCatalogo {
  id: string;
  texto: string;
  opcoes: OpcaoQuiz[];
}

export interface PerguntaAtiva {
  perguntaAmigoSecretoId: string;
  perguntaQuizId: string;
  texto: string;
  resposta?: OpcaoQuiz | null;
  perguntadaEm: string;
  respondidaEm?: string | null;
}

export interface PerguntaRecebida {
  perguntaAmigoSecretoId: string;
  texto: string;
  opcoes: OpcaoQuiz[];
  opcaoRespostaId?: string | null;
}

export interface InteresseResumo {
  id: string;
  nome: string;
}

export interface AmigoSecretoDetalhe {
  resultadoSorteioId: string;
  nomeRecebedor: string;
  fotoRecebedor?: string;
  bio?: string;
  idade?: number | null;
  genero: number;
  interesses: InteresseResumo[];
  listaDesejos?: ExibirListaDesejos | null;
  valor: number;
  dataSorteio: string;
  slotsTotais: number;
  slotsUsados: number;
  perguntasAtivas: PerguntaAtiva[];
  perguntasDisponiveis: PerguntaCatalogo[];
}

export async function buscarDetalhe(eventoId: string): Promise<AmigoSecretoDetalhe> {
  const response = await api.get(`/api/AmigoSecreto/${eventoId}/Detalhe`);
  return response.data.dados;
}

export async function listarCatalogoQuiz(): Promise<PerguntaCatalogo[]> {
  const response = await api.get(`/api/AmigoSecreto/QuizPerguntas`);
  return response.data.dados;
}

export async function perguntarQuiz(
  eventoId: string,
  perguntaQuizId: string,
): Promise<PerguntaAtiva> {
  const response = await api.post(`/api/AmigoSecreto/${eventoId}/Quiz/Perguntar`, {
    perguntaQuizId,
  });
  return response.data.dados;
}

export async function trocarPerguntaQuiz(
  perguntaAmigoSecretoId: string,
  novaPerguntaQuizId: string,
): Promise<PerguntaAtiva> {
  const response = await api.put(
    `/api/AmigoSecreto/Quiz/${perguntaAmigoSecretoId}/Trocar`,
    { novaPerguntaQuizId },
  );
  return response.data.dados;
}

export async function responderQuiz(
  perguntaAmigoSecretoId: string,
  opcaoId: string,
): Promise<PerguntaRecebida> {
  const response = await api.put(
    `/api/AmigoSecreto/Quiz/${perguntaAmigoSecretoId}/Responder`,
    { opcaoId },
  );
  return response.data.dados;
}

export async function listarPerguntasRecebidas(
  eventoId: string,
): Promise<PerguntaRecebida[]> {
  const response = await api.get(`/api/AmigoSecreto/${eventoId}/Quiz/Recebidas`);
  return response.data.dados;
}