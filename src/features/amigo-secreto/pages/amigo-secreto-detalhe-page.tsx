import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function avatarColor(nome: string) {
  return AVATAR_COLORS[nome.charCodeAt(0) % AVATAR_COLORS.length];
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export function AmigoSecretoDetalhePage() {
  const navigate = useNavigate();

  // TODO: buscar o amigo secreto sorteado deste evento na API.
  const amigoSecreto = { nome: "Helena Vaz" };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* ── CABEÇALHO ── */}
      <header className="flex items-center gap-3 border-b border-white/[0.07] px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        >
          <ChevronLeftIcon className="h-6 w-6" strokeWidth={1.8} />
        </button>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(amigoSecreto.nome)}`}
        >
          {iniciais(amigoSecreto.nome)}
        </div>

        <div className="flex flex-col">
          <span className="text-base font-bold leading-tight text-white">
            {amigoSecreto.nome}
          </span>
          <span className="text-xs font-medium text-blue-400">
            seu amigo secreto
          </span>
        </div>
      </header>

      {/* ── CONTEÚDO (lista de desejos virá aqui) ── */}
    </div>
  );
}
