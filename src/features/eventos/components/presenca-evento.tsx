import { useState, useRef, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ConfirmacoesEvento, ConfirmacaoMembro } from "../services/evento-service";
import { registrarParticipacao } from "../services/evento-service";

const OPCOES = [
  {
    value: 1,
    label: "✓ Vou!",
    inativo: "border-emerald-500/45 bg-emerald-500/10 text-emerald-400",
    ativo: "border-emerald-500 bg-emerald-500 text-[#12111a]",
  },
  {
    value: 3,
    label: "Talvez",
    inativo: "border-amber-400/45 bg-amber-400/10 text-amber-300",
    ativo: "border-amber-400 bg-amber-400 text-[#12111a]",
  },
  {
    value: 2,
    label: "✕ Não vou",
    inativo: "border-rose-400/45 bg-rose-400/10 text-rose-300",
    ativo: "border-rose-400 bg-rose-400 text-[#12111a]",
  },
] as const;

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function avatarColor(nome: string) {
  return AVATAR_COLORS[nome.charCodeAt(0) % AVATAR_COLORS.length];
}

interface Props {
  eventoId: string;
  dados: ConfirmacoesEvento;
  onVerTodos?: () => void;
}

const MAX_VISIVEL = 6;

export function PresencaEvento({ eventoId, dados, onVerTodos }: Props) {
  const [minha, setMinha] = useState<number | null>(dados.minhaConfirmacao);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statusAnterior = useRef<number | null>(dados.minhaConfirmacao);

  function confirmar(status: number) {
    if (status === minha) return;
    setMinha(status);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await registrarParticipacao(eventoId, status);
        statusAnterior.current = status;
      } catch {
        setMinha(statusAnterior.current);
      }
    }, 800);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  const visiveis = dados.confirmacoes.slice(0, MAX_VISIVEL);
  const extras = dados.confirmacoes.length - MAX_VISIVEL;

  return (
    <div className="flex flex-col gap-5">
      {/* SUA PRESENÇA */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
          Sua Presença
        </p>
        <div className="flex gap-2">
          {OPCOES.map((o) => (
            <button
              key={o.value}
              onClick={() => confirmar(o.value)}
              className={`flex-1 rounded-full border-[1.5px] py-3 px-2 text-[13px] font-bold transition-all ${
                minha === o.value ? o.ativo : o.inativo
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONFIRMADOS (compacto) */}
      {dados.confirmacoes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
            Confirmados ({dados.confirmacoes.length})
          </p>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/[0.07] bg-surface p-3.5 pb-1.5">
            {visiveis.map((m: ConfirmacaoMembro) => (
              <div
                key={m.usuarioId}
                className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/5 py-1 pl-1 pr-[11px]"
              >
                {m.fotoPerfil ? (
                  <img
                    src={m.fotoPerfil}
                    alt={m.nome}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${avatarColor(m.nome)}`}
                  >
                    {m.nome[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] font-medium text-white">
                  {m.nome.split(" ")[0]}
                </span>
              </div>
            ))}

            {extras > 0 && onVerTodos && (
              <button
                onClick={onVerTodos}
                className="mb-2 inline-flex items-center gap-1 rounded-full border border-dashed border-white/[0.07] px-3 py-[5px] text-[13px] text-white/[0.62]"
              >
                +{extras} ver todos
                <ChevronRightIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
