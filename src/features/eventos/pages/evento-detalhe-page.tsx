import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import {
  buscarEventoPorId,
  listarConfirmacoes,
  selecionarItemListaDesejos,
  desselecionarItemListaDesejos,
  type ExibirEvento,
  type ConfirmacoesEvento,
  type ExibirItemListaDesejos,
  type ConfirmacaoMembro,
} from "../services/evento-service";
import { PresencaEvento } from "../components/presenca-evento";
import { AmigoSecretoSorteiosPainel } from "../components/amigo-secreto-sorteio-painel";
import { getUsuarioIdFromToken } from "../../../lib/jwt";

const TIPO_MAP: Record<string, { emoji: string; label: string; gradient: string }> = {
  "0": { emoji: "🎁", label: "Amigo Secreto",           gradient: "from-blue-900 to-blue-700" },
  "1": { emoji: "🍫", label: "Amigo Chocolate Sortudo", gradient: "from-amber-900 to-amber-700" },
  "2": { emoji: "🎂", label: "Aniversário",             gradient: "from-pink-900 to-pink-700" },
  "3": { emoji: "💍", label: "Casamento",               gradient: "from-purple-900 to-purple-700" },
};

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function avatarColor(nome: string) {
  return AVATAR_COLORS[nome.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatarDataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

function formatarHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit",
  });
}

function diasRestantes(iso: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const evento = new Date(iso);
  evento.setHours(0, 0, 0, 0);
  const diff = Math.ceil((evento.getTime() - hoje.getTime()) / 86400000);
  if (diff < 0) return "Encerrado";
  if (diff === 0) return "Hoje!";
  return `Em ${diff} dia${diff > 1 ? "s" : ""}`;
}

const STATUS_PARTICIPANTE: Record<number, { label: string; cls: string }> = {
  1: { label: "Vou!",    cls: "bg-emerald-500/10 text-emerald-500" },
  2: { label: "Não vou", cls: "bg-rose-400/10 text-rose-400" },
  3: { label: "Talvez",  cls: "bg-amber-400/10 text-amber-300" },
};

export function EventoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [evento, setEvento] = useState<ExibirEvento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [confirmacoes, setConfirmacoes] = useState<ConfirmacoesEvento | null>(null);
  const [itens, setItens] = useState<ExibirItemListaDesejos[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"detalhes" | "participantes">("detalhes");
  const [verMaisDescricao, setVerMaisDescricao] = useState(false);

  const meuId = useMemo(() => getUsuarioIdFromToken() ?? "", []);

  useEffect(() => {
    if (!id) return;
    Promise.all([buscarEventoPorId(id), listarConfirmacoes(id)])
      .then(([ev, conf]) => {
        setEvento(ev);
        setConfirmacoes(conf);
        setItens(ev.listaDesejos?.itens ?? []);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [id]);

  async function toggleItem(itemId: string, jaSelecionado: boolean) {
    try {
      const atualizado = jaSelecionado
        ? await desselecionarItemListaDesejos(itemId)
        : await selecionarItemListaDesejos(itemId);
      setItens((prev) => prev.map((i) => (i.id === itemId ? atualizado : i)));
    } catch {
      // mantém estado anterior silenciosamente
    }
  }

  const tipo = evento
    ? (TIPO_MAP[String(evento.tipoEvento)] ?? { emoji: "🎉", label: String(evento.tipoEvento), gradient: "from-gray-900 to-gray-700" })
    : null;

  return (
    <div className="flex flex-col min-h-dvh bg-background">

      {/* ── HERO ── */}
      <div className="relative">
        {carregando ? (
          <div className="h-60 bg-surface" />
        ) : evento?.fotoCapaUrl ? (
          <div className="relative h-60 overflow-hidden">
            <img src={evento.fotoCapaUrl} alt={evento.titulo} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
          </div>
        ) : tipo ? (
          <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${tipo.gradient}`}>
            <span className="absolute inset-0 flex items-center justify-center text-[80px] opacity-[0.18]">
              {tipo.emoji}
            </span>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
          </div>
        ) : (
          <div className="h-44 bg-surface" />
        )}

        {/* Botões flutuantes */}
        <div className="absolute inset-x-0 top-[54px] z-10 flex justify-between px-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.07] bg-background/55 text-white backdrop-blur-md hover:bg-background/75 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.8} />
          </button>

          {evento && evento.criador === meuId && (
            <button
              onClick={() => navigate(`/eventos/${id}/editar`)}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.07] bg-background/55 text-white backdrop-blur-md hover:bg-background/75 transition-colors"
            >
              <PencilSquareIcon className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* ── ESTADOS DE CARREGAMENTO / ERRO ── */}
      {carregando && (
        <p className="text-white/[0.42] text-sm text-center mt-10">Carregando...</p>
      )}
      {erro && (
        <p className="text-red-400 text-sm text-center mt-10">Não foi possível carregar o evento.</p>
      )}

      {/* ── CONTEÚDO ── */}
      {evento && tipo && (
        <div className="flex flex-col">

          {/* Badge + título + criador */}
          <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/[0.62]">
              {tipo.emoji} {tipo.label}
            </span>

            <h1 className="text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-white text-balance">
              {evento.titulo}
            </h1>

            {evento.criadorNome && (
              <div className="flex items-center gap-2">
                <div
                  className={`h-[22px] w-[22px] shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${avatarColor(evento.criadorNome)}`}
                >
                  {evento.criadorNome[0].toUpperCase()}
                </div>
                <span className="text-[13px] text-white/[0.62]">
                  por <span className="font-medium text-white">{evento.criadorNome}</span>
                </span>
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="flex border-b border-white/[0.07] px-2 mt-2">
            {(["detalhes", "participantes"] as const).map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`relative flex-1 py-[13px] text-[13px] font-bold transition-colors ${
                  abaAtiva === aba ? "text-emerald-500" : "text-white/[0.42]"
                }`}
              >
                {aba === "detalhes"
                  ? "Detalhes"
                  : `Participantes${confirmacoes ? ` (${confirmacoes.confirmacoes.length})` : ""}`}
                {abaAtiva === aba && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 rounded bg-emerald-500" />
                )}
              </button>
            ))}
          </div>

          {/* ── ABA DETALHES ── */}
          {abaAtiva === "detalhes" && (
            <div className="flex flex-col gap-5 px-4 pt-5 pb-10">

              {/* Card QUANDO + ONDE unificado */}
              {(evento.dataInicio || evento.localizacao) && (
                <div className="rounded-2xl border border-white/[0.07] bg-surface px-4">
                  {evento.dataInicio && (
                    <div className={`flex items-start gap-3.5 py-3.5 ${evento.localizacao ? "border-b border-white/[0.06]" : ""}`}>
                      <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/[0.42]" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/[0.42] mb-0.5">
                          Quando
                        </p>
                        <p className="text-sm font-medium leading-[1.35] text-white capitalize">
                          {formatarDataCurta(evento.dataInicio)} · {formatarHora(evento.dataInicio)}
                        </p>
                        <p className="text-xs text-white/[0.62] mt-0.5">
                          {diasRestantes(evento.dataInicio)}
                        </p>
                      </div>
                    </div>
                  )}

                  {evento.localizacao && (
                    <div className="flex items-start gap-3.5 py-3.5">
                      <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/[0.42]" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/[0.42] mb-0.5">
                          Onde
                        </p>
                        <p className="text-sm font-medium leading-[1.35] text-white">
                          {evento.localizacao}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOBRE */}
              {evento.descricao && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
                    Sobre
                  </p>
                  <p className={`text-sm leading-[1.6] text-white/[0.62] ${!verMaisDescricao ? "line-clamp-3" : ""}`}>
                    {evento.descricao}
                  </p>
                  {evento.descricao.length > 150 && (
                    <button
                      onClick={() => setVerMaisDescricao((v) => !v)}
                      className="self-start text-xs font-semibold text-emerald-500 hover:underline"
                    >
                      {verMaisDescricao ? "Ler menos" : "Ler mais"}
                    </button>
                  )}
                </div>
              )}

              {/* SUA PRESENÇA + CONFIRMADOS */}
              {confirmacoes && (
                <PresencaEvento
                  eventoId={evento.id}
                  dados={confirmacoes}
                  onVerTodos={() => setAbaAtiva("participantes")}
                />
              )}

              {/* GERENCIAR SORTEIO (amigo secreto, só para o criador) */}
              {evento.tipoEvento === 0 && evento.criador === meuId && (
                <div className="flex flex-col gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
                    Gerenciar sorteio
                  </p>
                  <AmigoSecretoSorteiosPainel evento={evento} onSorteioExecutado={setEvento} />
                </div>
              )}

              {/* LISTA DE PRESENTES */}
              {evento.listaDesejos && itens.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
                      Lista de presentes
                    </p>
                    <span className="text-[11px] text-white/[0.42]">{itens.length} itens</span>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-surface px-3.5">
                    {itens.map((item, idx) => {
                      const reservadoPorMim = item.reservadoPorId === meuId;
                      const reservado = !!item.reservadoPorId;
                      const isLast = idx === itens.length - 1;

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 py-[13px] ${!isLast ? "border-b border-white/[0.06]" : ""}`}
                        >
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className={`text-sm font-medium ${reservado && !reservadoPorMim ? "text-white/[0.62] line-through decoration-white/25" : "text-white"}`}>
                              {item.descricao}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/[0.42]">
                              {item.urlReference && (
                                <a
                                  href={item.urlReference}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline truncate max-w-[160px]"
                                >
                                  referência ↗
                                </a>
                              )}
                              {reservado && item.reservadoPorNome && (
                                <span className="flex items-center gap-1">
                                  {item.reservadoPorFoto ? (
                                    <img
                                      src={item.reservadoPorFoto}
                                      alt={item.reservadoPorNome}
                                      className="h-4 w-4 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${avatarColor(item.reservadoPorNome)}`}>
                                      {item.reservadoPorNome[0].toUpperCase()}
                                    </div>
                                  )}
                                  <span>
                                    {reservadoPorMim
                                      ? "Você cuida"
                                      : `${item.reservadoPorNome.split(" ")[0]} cuida`}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          {!reservado && (
                            <button
                              onClick={() => toggleItem(item.id, false)}
                              className="shrink-0 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#0b1a14] hover:bg-emerald-400 transition-colors"
                            >
                              Reservar
                            </button>
                          )}
                          {reservadoPorMim && (
                            <button
                              onClick={() => toggleItem(item.id, true)}
                              className="shrink-0 h-7 w-7 rounded-full border border-white/[0.07] flex items-center justify-center text-white/[0.42] hover:text-white transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ABA PARTICIPANTES ── */}
          {abaAtiva === "participantes" && (
            <div className="flex flex-col gap-4 px-4 pt-5 pb-10">
              {!confirmacoes || confirmacoes.confirmacoes.length === 0 ? (
                <p className="text-white/[0.42] text-sm text-center mt-10">
                  Nenhum participante confirmado ainda.
                </p>
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/[0.42]">
                    Confirmados ({confirmacoes.confirmacoes.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {confirmacoes.confirmacoes.map((m: ConfirmacaoMembro) => {
                      const status = STATUS_PARTICIPANTE[m.status];
                      return (
                        <div
                          key={m.usuarioId}
                          className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-surface px-4 py-3"
                        >
                          {m.fotoPerfil ? (
                            <img
                              src={m.fotoPerfil}
                              alt={m.nome}
                              className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`h-[38px] w-[38px] shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white ${avatarColor(m.nome)}`}>
                              {m.nome[0].toUpperCase()}
                            </div>
                          )}
                          <span className="flex-1 text-sm font-medium text-white">{m.nome}</span>
                          {status && (
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
                              {status.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
