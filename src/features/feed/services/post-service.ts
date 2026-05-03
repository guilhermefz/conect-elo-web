import api from "../../../lib/axios";

export interface CriarPostagemDto {
  conteudo: string;
  usuarioId: string;
  muralId: string;
}

export async function criarPostagem(dto: CriarPostagemDto) {
  const response = await api.post("/api/Postagem/Salvar", dto);
  return response.data;
}

export interface FeedPostagemDto {
  id: string;
  conteudo: string;
  dataPostagem: string;
  usuarioId: string;
  nomeAutor: string;
  muralId: string;
  grupoId: string;
  nomeGrupo: string;
}

export async function obterFeed(usuarioId: string, pagina = 1, tamanhoPagina = 20): Promise<FeedPostagemDto[]> {
  const response = await api.get("/api/Feed", {
    params: { usuarioId, pagina, tamanhoPagina },
  });
  return response.data.dados;
}
