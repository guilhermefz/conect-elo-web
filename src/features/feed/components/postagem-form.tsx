import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { criarPostagem } from "../services/post-service";
import { obterPerfil, buildFotoUrl } from "../../perfil/services/perfil-service";

interface Props {
  usuarioId: string;
  muralId: string;
  onPostar?: () => void;
}

export function PostagemForm({ usuarioId, muralId, onPostar }: Props) {
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    obterPerfil()
      .then((d) => { if (d.fotoPerfilUrl) setFotoUrl(buildFotoUrl(d.fotoPerfilUrl)); })
      .catch(() => {});

    function handleFotoAtualizada(e: Event) {
      setFotoUrl((e as CustomEvent<string>).detail);
    }
    window.addEventListener("foto-perfil-atualizada", handleFotoAtualizada);
    return () => window.removeEventListener("foto-perfil-atualizada", handleFotoAtualizada);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      await criarPostagem({ conteudo, usuarioId, muralId });
      setConteudo("");
      onPostar?.();
    } catch {
      setErro("Erro ao criar postagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="size-9 shrink-0 rounded-full bg-green-500 overflow-hidden flex items-center justify-center text-base select-none">
        {fotoUrl
          ? <img src={fotoUrl} alt="Perfil" className="size-full object-cover" />
          : "🤝"
        }
      </div>
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
        <PaperAirplaneIcon className="size-4" />
      </button>
    </form>
  );
}
