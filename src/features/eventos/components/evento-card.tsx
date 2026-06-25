import { useState } from "react";
import type { ExibirEventoResumo } from "../services/evento-service";
import { useNavigate } from "react-router-dom";
import { registrarParticipacao } from "../services/evento-service";

const TIPO_MAP: Record<string, { emoji: string; label: string; badge: string; gradient: string }> = {
    "0": { emoji: "🎁", label: "Amigo Secreto",           badge: "bg-blue-500/20 text-blue-300",   gradient: "from-blue-900 to-blue-700" },
    "1": { emoji: "🍫", label: "Amigo Chocolate Sortudo", badge: "bg-amber-500/20 text-amber-300", gradient: "from-amber-900 to-amber-700" },
    "2": { emoji: "🎂", label: "Aniversário",             badge: "bg-pink-500/20 text-pink-300",   gradient: "from-pink-900 to-pink-700" },
    "3": { emoji: "💍", label: "Casamento",               badge: "bg-purple-500/20 text-purple-300", gradient: "from-purple-900 to-purple-700" },
};

const PARTICIPACAO_MAP: Record<number, { label: string; badge: string }> = {
  1: { label: "✓ Vou!",    badge: "bg-green-500/20 text-green-300" },
  2: { label: "✕ Não vou", badge: "bg-pink-500/20 text-pink-400" },
  3: { label: "Talvez",    badge: "bg-yellow-500/20 text-yellow-300" },
};

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

function diasRestantes(iso: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const evento = new Date(iso);
  evento.setHours(0, 0, 0, 0);
  const diff = Math.ceil((evento.getTime() - hoje.getTime()) / 86400000);
  if (diff < 0) return "Encerrado";
  if (diff === 0) return "Hoje!";
  return `${diff} dias`;
}

interface Props {
    evento: ExibirEventoResumo;
}

export function EventoCard({ evento }: Props) {
  const navigate = useNavigate();
  const tipo = TIPO_MAP[String(evento.tipoEvento)] ?? {
    emoji: "🎉",
    label: String(evento.tipoEvento),
    badge: "bg-white/10 text-gray-300",
    gradient: "from-gray-900 to-gray-700",
  };

  const [participacao, setParticipacao] = useState<number | null>(
    evento.participacaoUsuario ?? null
  );
  const [enviando, setEnviando] = useState(false);

  async function handleParticipacao(e: React.MouseEvent, status: number) {
    e.stopPropagation();
    if (enviando) return;
    setEnviando(true);
    try {
      await registrarParticipacao(evento.id, status);
      setParticipacao(status);
    } finally {
      setEnviando(false);
    }
  }

   return (
    <div
      onClick={() => navigate(`/eventos/${evento.id}`)}
      className="mx-4 my-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer active:opacity-70 transition-opacity"
    >
       {evento.fotoCapaUrl ? (
         <img
           src={evento.fotoCapaUrl}
           alt={evento.titulo}
           className="w-full h-36 object-cover"
         />
      ) : (
        <div className={`w-full h-28 bg-gradient-to-br ${tipo.gradient} flex items-center justify-center`}>
          <span className="text-5xl opacity-40">{tipo.emoji}</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tipo.badge}`}>
            {tipo.emoji} {tipo.label}
          </span>
          {evento.dataInicio && (
            <span className="text-gray-400 text-xs whitespace-nowrap">
              {diasRestantes(evento.dataInicio)}
            </span>
          )}
        </div>

        <p className="text-white font-bold text-base leading-snug">{evento.titulo}</p>

        {evento.criadorNome && (
          <p className="text-gray-500 text-xs">por {evento.criadorNome}</p>
        )}

        <div className="flex flex-col gap-1 mt-0.5">
          {evento.dataInicio && (
            <p className="text-gray-400 text-xs">📅 {formatarData(evento.dataInicio)}</p>
          )}
          {evento.localizacao && (
            <p className="text-gray-400 text-xs truncate">📍 {evento.localizacao}</p>
          )}
        </div>

         <div className="mt-2 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
          {participacao !== null ? (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PARTICIPACAO_MAP[participacao]?.badge ?? "bg-white/10 text-gray-300"}`}>
              {PARTICIPACAO_MAP[participacao]?.label ?? "Respondido"}
            </span>
          ) : (
            <div className="flex gap-2">
              {[
                { status: 1, label: "✓ Vou!",    cls: "bg-green-500/20 text-green-300 active:bg-green-500/40" },
                { status: 3, label: "Talvez",    cls: "bg-yellow-500/20 text-yellow-300 active:bg-yellow-500/40" },
                { status: 2, label: "✕ Não vou", cls: "bg-pink-500/20 text-pink-400 active:bg-pink-500/40" },
              ].map(({ status, label, cls }) => (
                <button
                  key={status}
                  disabled={enviando}
                  onClick={(e) => handleParticipacao(e, status)}
                  className={`flex-1 text-xs font-semibold py-1.5 rounded-full transition-opacity disabled:opacity-40 ${cls}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}