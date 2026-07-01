import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Evento, TipoMeta } from "../types";
import { ICONE_META } from "../utils/formatar-meta";
import { useToast } from "../../../components/toast";

interface Props {
  evento: Evento;
  tipoMeta: TipoMeta;
  onFechar: () => void;
}

export function EventoDetalheModal({ evento, tipoMeta, onFechar }: Props) {
  const toast = useToast();
  const MetaIcon = ICONE_META[tipoMeta];
  const [imgErro, setImgErro] = useState(false);

  function handleInteresse() {
    toast.sucesso("Interesse registrado! Avisaremos quando abrir inscrição.");
    onFechar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div
        className="fade-enter absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onFechar}
      />

      {/* sheet */}
      <div className="sheet-enter relative w-full max-w-md rounded-t-3xl border border-white/[0.08] bg-surface sm:rounded-3xl">
        {/* handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        {/* CABEÇALHO */}
        <div className="flex items-center gap-3 px-4 pb-3 pt-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-xl"
            style={imgErro ? { background: evento.imagemCor } : undefined}
          >
            {imgErro ? (
              evento.emoji
            ) : (
              <img
                src={evento.imagemUrl}
                alt={evento.titulo}
                onError={() => setImgErro(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-base font-bold leading-tight text-white">
              {evento.titulo}
            </span>
            <span className="text-xs font-medium text-blue-400">
              {evento.emoji} {evento.categoria}
            </span>
          </div>

          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <XMarkIcon className="size-6" strokeWidth={1.8} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="flex flex-col gap-4 px-4 pb-5">
          {/* card "Sobre o evento" — espelha o estilo da referência */}
          <section className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-white">Sobre o evento</h2>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                <MetaIcon className="size-3.5" />
                {evento.meta}
              </span>
            </div>

            <p className="text-sm font-medium text-white/[0.85]">{evento.resumo}</p>
            <p className="text-sm leading-[1.5] text-white/[0.6]">{evento.descricao}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {evento.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-white/[0.07] bg-surface px-3 py-1.5 text-xs font-medium text-white/[0.8]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* AÇÃO */}
          <button
            onClick={handleInteresse}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1a14] transition-colors hover:bg-emerald-400"
          >
            Tenho interesse
          </button>
        </div>
      </div>
    </div>
  );
}
