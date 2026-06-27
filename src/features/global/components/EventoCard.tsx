import { useState } from "react";
import type { Evento, TipoMeta } from "../types";
import { ICONE_META } from "../utils/formatar-meta";

interface Props {
  evento: Evento;
  tipoMeta: TipoMeta;
  onAbrir: (id: number) => void;
}

export function EventoCard({ evento, tipoMeta, onAbrir }: Props) {
  const MetaIcon = ICONE_META[tipoMeta];
  const [imgErro, setImgErro] = useState(false);

  return (
    <button
      onClick={() => onAbrir(evento.id)}
      className="flex flex-col gap-2 w-36 shrink-0 snap-start text-left"
    >
      <div
        className="w-full aspect-square rounded-xl overflow-hidden relative"
        style={imgErro ? { background: evento.imagemCor } : undefined}
      >
        {!imgErro && (
          <img
            src={evento.imagemUrl}
            alt={evento.titulo}
            onError={() => setImgErro(true)}
            className="w-full h-full object-cover"
          />
        )}

        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/70 backdrop-blur-md border border-white/15 text-white text-xs font-medium">
          {evento.emoji} {evento.categoria}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
          {evento.titulo}
        </p>
        <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
          <MetaIcon className="size-3 shrink-0" />
          {evento.meta}
        </span>
      </div>
    </button>
  );
}
