import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { buscarEventoPorId, type ExibirEvento } from "../services/evento-service";

const TIPO_MAP: Record<string, { emoji: string; label: string; badge: string }> = {
  "0": { emoji: "🎁", label: "Amigo Secreto",           badge: "bg-blue-500/20 text-blue-300" },
  "1": { emoji: "🍫", label: "Amigo Chocolate Sortudo", badge: "bg-amber-500/20 text-amber-300" },
  "2": { emoji: "🎂", label: "Aniversário",             badge: "bg-pink-500/20 text-pink-300" },
  "3": { emoji: "💍", label: "Casamento",               badge: "bg-purple-500/20 text-purple-300" },
};

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function EventoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<ExibirEvento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!id) return;
    buscarEventoPorId(id)
      .then(setEvento)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [id]);

  const tipo = evento ? (TIPO_MAP[String(evento.tipoEvento)] ?? { emoji: "🎉", label: String(evento.tipoEvento), badge: "bg-white/10 text-gray-300" }) : null;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="size-9 flex items-center justify-center rounded-xl bg-white/5 text-white">
          <ArrowLeftIcon className="size-4" />
        </button>
        <span className="text-white font-bold text-sm uppercase tracking-widest">Evento</span>
      </div>

      {carregando && (
        <p className="text-gray-500 text-sm text-center mt-16">Carregando...</p>
      )}

      {erro && (
        <p className="text-red-400 text-sm text-center mt-16">Não foi possível carregar o evento.</p>
      )}

      {evento && tipo && (
        <div className="flex flex-col gap-6 px-4 py-6">
          <div className="flex flex-col gap-3">
            <span className={`self-start flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tipo.badge}`}>
              {tipo.emoji} {tipo.label}
            </span>
            <h1 className="text-white font-bold text-2xl leading-snug">{evento.titulo}</h1>
          </div>

          <div className="flex flex-col gap-3">
            {evento.dataInicio && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Data do evento</p>
                  <p className="text-white text-sm capitalize">{formatarData(evento.dataInicio)}</p>
                </div>
              </div>
            )}

            {evento.localizacao && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Local</p>
                  <p className="text-white text-sm">{evento.localizacao}</p>
                </div>
              </div>
            )}

            {evento.descricao && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xl">📝</span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Descrição</p>
                  <p className="text-white text-sm leading-relaxed">{evento.descricao}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}