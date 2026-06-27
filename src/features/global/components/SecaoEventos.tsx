import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { CarrosselHorizontal } from "./CarrosselHorizontal";
import { EventoCard } from "./EventoCard";
import type { Secao } from "../types";

interface Props {
  secao: Secao;
  onAbrirEvento: (id: number) => void;
  onVerTudo: (secaoId: string) => void;
}

export function SecaoEventos({ secao, onAbrirEvento, onVerTudo }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start justify-between px-4">
        <div>
          <h2 className="text-white font-bold text-base">{secao.titulo}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{secao.subtitulo}</p>
        </div>
        <button
          onClick={() => onVerTudo(secao.id)}
          className="flex items-center gap-0.5 text-emerald-500 text-xs font-semibold mt-1 shrink-0"
        >
          Ver tudo <ChevronRightIcon className="size-3.5" />
        </button>
      </div>

      <div className="pl-4">
        <CarrosselHorizontal>
          {secao.eventos.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              tipoMeta={secao.tipoMeta}
              onAbrir={onAbrirEvento}
            />
          ))}
          <div className="w-4 shrink-0" />
        </CarrosselHorizontal>
      </div>
    </section>
  );
}
