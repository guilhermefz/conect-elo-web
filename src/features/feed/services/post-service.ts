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
