import type { FeedPostagemDto } from "../services/post-service";
import { buildFotoUrl } from "../../perfil/services/perfil-service";

interface Props {
  post: FeedPostagemDto;
}

export function PostCard({ post }: Props) {
  const data = new Date(post.dataPostagem).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const fotoUrl = post.fotoPerfilUrl ? buildFotoUrl(post.fotoPerfilUrl) : null;

  return (
    <div className="bg-[#1e1b2e] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-sm select-none shrink-0">
          {fotoUrl
            ? <img src={fotoUrl} alt={post.nomeAutor} className="size-full object-cover" />
            : "🤝"
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold leading-tight">{post.nomeAutor}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-emerald-500 text-xs font-semibold truncate">{post.nomeGrupo}</span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-500 text-xs shrink-0">{data}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{post.conteudo}</p>
    </div>
  );
}
