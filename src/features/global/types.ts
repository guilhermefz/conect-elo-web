export type TipoMeta = "distancia" | "data" | "popularidade";

export interface Evento {
  id: number;
  titulo: string;
  categoria: string;
  emoji: string;
  imagemUrl: string;
  imagemCor: string;
  meta: string;
}

export interface Secao {
  id: string;
  titulo: string;
  subtitulo: string;
  tipoMeta: TipoMeta;
  eventos: Evento[];
}
