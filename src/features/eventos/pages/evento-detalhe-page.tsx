import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { buscarEventoPorId, listarConfirmacoes, type ExibirEvento, type ConfirmacoesEvento } from "../services/evento-service";
import { PresencaEvento } from "../components/presenca-evento";

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
  const [confirmacoes, setConfirmacoes] = useState<ConfirmacoesEvento | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([buscarEventoPorId(id), listarConfirmacoes(id)])
      .then(([ev, conf]) => {
        setEvento(ev);
        setConfirmacoes(conf);
      })
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
          {evento.fotoCapaUrl && (
            <img src={evento.fotoCapaUrl} alt={evento.titulo} className="w-full h-48 object-cover rounded-2xl" />
          )}
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

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl">🗓️</span>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Criado em</p>
                <p className="text-white text-sm capitalize">{formatarData(evento.dataCriacao)}</p>
              </div>
            </div>

            {evento.criadorNome && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xl">👤</span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Criado por</p>
                  <p className="text-white text-sm">{evento.criadorNome}</p>
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

          {confirmacoes && (
            <PresencaEvento eventoId={evento.id} dados={confirmacoes} />
          )}

          {evento.listaDesejos && (
            <div className="flex flex-col gap-3">
              <h2 className="text-white font-semibold text-base flex items-center gap-2">
                🎁 Lista de desejos
                <span className="text-gray-500 text-xs font-normal">— {evento.listaDesejos.titulo}</span>
              </h2>
              <div className="flex flex-col gap-2">
                {evento.listaDesejos.itens.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-lg mt-0.5">{item.reservadoPorId ? "✅" : "🎀"}</span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-white text-sm">{item.descricao}</p>
                      {item.urlReference && (
                        <a
                          href={item.urlReference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs truncate hover:underline"
                        >
                          {item.urlReference}
                        </a>
                      )}
                      {item.reservadoPorId && (
                        <p className="text-gray-500 text-xs">Reservado</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}