import type { ExibirEventoResumo } from "../services/evento-service";
import { useNavigate } from "react-router-dom";

const TIPO_MAP: Record<string, { emoji: string; label: string; badge: string }> = {
    "0": { emoji: "🎁", label: "Amigo Secreto",           badge: "bg-blue-500/20 text-blue-300" },
    "1": { emoji: "🍫", label: "Amigo Chocolate Sortudo", badge: "bg-amber-500/20 text-amber-300" },
    "2": { emoji: "🎂", label: "Aniversário",             badge: "bg-pink-500/20 text-pink-300" },
    "3": { emoji: "💍", label: "Casamento",               badge: "bg-purple-500/20 text-purple-300" },
};

function formatarDia(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
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
  const tipo = TIPO_MAP[String(evento.tipoEvento)] ?? { emoji: "🎉", label: String(evento.tipoEvento), badge: "bg-white/10 text-gray-300" };
  const navigate = useNavigate();

   return (
    <div onClick={() => navigate(`/eventos/${evento.id}`)}
               className="mx-4 my-2 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3 cursor-pointer active:opacity-70 transition-opacity">
      <div className="flex items-center justify-between gap-2">
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tipo.badge}`}>
          {tipo.emoji} {tipo.label}
        </span>
        {evento.dataInicio && (
          <span className="text-gray-400 text-xs whitespace-nowrap">
            {formatarDia(evento.dataInicio)} · {diasRestantes(evento.dataInicio)}
          </span>
        )}
      </div>

      <div>
        <p className="text-white font-bold text-base leading-snug">{evento.titulo}</p>
        {(evento.localizacao || evento.descricao) && (
          <p className="text-gray-400 text-sm mt-0.5 truncate">
            {evento.localizacao ?? evento.descricao}
          </p>
        )}
      </div>
    </div>
  );
}