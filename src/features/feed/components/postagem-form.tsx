import { useState } from "react";
import { criarPostagem } from "../services/post-service";

interface Props {
  usuarioId: string;
  muralId: string;
}

export function PostagemForm({ usuarioId, muralId }: Props) {
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso(false);

    try {
      await criarPostagem({ conteudo, usuarioId, muralId });
      setSucesso(true);
      setConteudo("");
    } catch {
      setErro("Erro ao criar postagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="O que você está pensando?"
        className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none resize-none"
        rows={4}
        required
      />
      {erro && <p className="text-sm text-red-500">{erro}</p>}
      {sucesso && <p className="text-sm text-green-500">Postagem criada com sucesso!</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-end rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
