export type TipoMeta = "distancia" | "data" | "popularidade";

export interface Evento {
  id: number;
  titulo: string;
  categoria: string;
  emoji: string;
  imagemUrl: string;
  imagemCor: string;
  meta: string;
  /** Resumo curto exibido na "breve descrição" (uma linha). */
  resumo: string;
  /** Parágrafo de descrição do evento. */
  descricao: string;
  /** Chips temáticos do evento (categorias, vibe, etc.). */
  tags: string[];
}

export interface Secao {
  id: string;
  titulo: string;
  subtitulo: string;
  tipoMeta: TipoMeta;
  eventos: Evento[];
}
