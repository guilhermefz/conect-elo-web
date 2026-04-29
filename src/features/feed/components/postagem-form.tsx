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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      await criarPostagem({ conteudo, usuarioId, muralId });
      setConteudo("");
    } catch {
      setErro("Erro ao criar postagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="size-9 shrink-0 rounded-full bg-green-500 flex items-center justify-center text-base select-none">🤝</div>
      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="No que está pensando?"
        className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none resize-none"
        rows={1}
        required
      />
      {erro && <p className="text-xs text-red-400 shrink-0">{erro}</p>}
      <button
        type="submit"
        disabled={loading}
        title="Publicar"
        className="size-8 shrink-0 rounded-full bg-gray-700 flex items-center justify-center text-green-400 hover:bg-gray-600 disabled:opacity-50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </button>
    </form>
  );
}
