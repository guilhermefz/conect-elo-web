import { EyeIcon } from "@heroicons/react/24/outline";

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

interface AmigoSecretoResultadoCardProps {
  /** Nome da pessoa tirada no sorteio. */
  nome: string;
  /** Foto de perfil da pessoa tirada. */
  foto?: string;
  /** Ação disparada ao clicar em "Ver detalhes". */
  onVerDetalhes?: () => void;
}

export function AmigoSecretoResultadoCard({
  nome,
  foto,
  onVerDetalhes,
}: AmigoSecretoResultadoCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-surface p-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-300">
        🎁 Seu amigo secreto
      </span>

      <div className="flex items-center gap-3">
        {foto ? (
          <img
            src={foto}
            alt={nome}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(nome)}`}
          >
            {iniciais(nome)}
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-base font-bold leading-tight text-white">
            {nome}
          </span>
          <span className="text-sm text-white/[0.55]">
            Veja a lista de desejos 🎁
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onVerDetalhes}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-400"
      >
        <EyeIcon className="size-5" />
        Ver detalhes
      </button>
    </div>
  );
}
