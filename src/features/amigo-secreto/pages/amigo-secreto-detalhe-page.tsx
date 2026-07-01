import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeftIcon,
  GiftIcon,
  LinkIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  buscarDetalhe,
  type AmigoSecretoDetalhe,
} from "../services/amigo-secreto-service";
import { QuizPerguntarCard } from "../components/quiz-perguntar-card";

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

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AmigoSecretoDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [detalhe, setDetalhe] = useState<AmigoSecretoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [trocandoId, setTrocandoId] = useState<string | null>(null);

  const carregarDetalhe = useCallback(async () => {
    if (!id) return;
    const dados = await buscarDetalhe(id);
    setDetalhe(dados);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    carregarDetalhe()
      .then(() => setErro(null))
      .catch(() => setErro("Não foi possível carregar o seu amigo secreto."))
      .finally(() => setCarregando(false));
  }, [id, carregarDetalhe]);

  async function aoConcluirQuiz() {
    setTrocandoId(null);
    await carregarDetalhe();
  }

  const nome = detalhe?.nomeRecebedor ?? "";
  const lista = detalhe?.listaDesejos;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* ── CABEÇALHO ── */}
      <header className="flex items-center gap-3 border-b border-white/[0.07] px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        >
          <ChevronLeftIcon className="h-6 w-6" strokeWidth={1.8} />
        </button>

        {nome && (
          <>
            {detalhe?.fotoRecebedor ? (
              <img
                src={detalhe.fotoRecebedor}
                alt={nome}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(nome)}`}
              >
                {iniciais(nome)}
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-white">
                {nome}
              </span>
              <span className="text-xs font-medium text-blue-400">
                seu amigo secreto
              </span>
            </div>
          </>
        )}
      </header>

      {/* ── CONTEÚDO ── */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {carregando && <p className="text-sm text-white/[0.55]">Carregando…</p>}

        {!carregando && erro && <p className="text-sm text-red-400">{erro}</p>}

        {!carregando && !erro && detalhe && (
          <>
            {/* SOBRE O RECEBEDOR */}
            {(detalhe.bio || detalhe.interesses.length > 0 || detalhe.valor > 0) && (
              <section className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-white">Sobre {nome.split(/\s+/)[0]}</h2>
                  {detalhe.valor > 0 && (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                      até {formatarValor(detalhe.valor)}
                    </span>
                  )}
                </div>

                {detalhe.bio && (
                  <p className="text-sm leading-[1.5] text-white/[0.7]">{detalhe.bio}</p>
                )}

                {detalhe.interesses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detalhe.interesses.map((interesse) => (
                      <span
                        key={interesse.id}
                        className="rounded-lg border border-white/[0.07] bg-background px-3 py-1.5 text-xs font-medium text-white/[0.8]"
                      >
                        {interesse.nome}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* LISTA DE DESEJOS */}
            {lista && (
              <section className="flex flex-col gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <GiftIcon className="size-5 text-amber-300" />
                  {lista.titulo || "Lista de desejos"}
                </h2>

                {lista.itens.length === 0 ? (
                  <p className="text-sm text-white/[0.55]">
                    Nenhum item na lista de desejos ainda.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {lista.itens.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-surface p-3"
                      >
                        <span className="text-sm text-white">{item.descricao}</span>
                        {item.urlReference && (
                          <a
                            href={item.urlReference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                          >
                            <LinkIcon className="size-4" />
                            Ver
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {!lista && (
              <p className="text-sm text-white/[0.55]">
                Esta pessoa ainda não montou uma lista de desejos.
              </p>
            )}

            {/* QUIZ — DESCOBRIR O AMIGO */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <SparklesIcon className="size-5 text-emerald-300" />
                  Descubra {nome.split(/\s+/)[0]}
                </h2>
                <span className="text-[11px] font-medium text-white/[0.45]">
                  {detalhe.slotsUsados}/{detalhe.slotsTotais} perguntas
                </span>
              </div>
              <p className="text-sm leading-[1.5] text-white/[0.55]">
                Faça até {detalhe.slotsTotais} perguntas anônimas para acertar no presente.
              </p>

              {/* Perguntas já feitas */}
              {detalhe.perguntasAtivas.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {detalhe.perguntasAtivas.map((pergunta) => (
                    <li
                      key={pergunta.perguntaAmigoSecretoId}
                      className="flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-surface p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-bold text-white">{pergunta.texto}</span>
                        <button
                          type="button"
                          onClick={() => setTrocandoId(pergunta.perguntaAmigoSecretoId)}
                          className="flex shrink-0 items-center gap-1 text-xs font-medium text-white/[0.55] transition-colors hover:text-white"
                        >
                          <ArrowPathIcon className="size-4" />
                          Trocar
                        </button>
                      </div>
                      {pergunta.resposta ? (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
                          {pergunta.resposta.emoji && (
                            <span className="text-sm leading-none">{pergunta.resposta.emoji}</span>
                          )}
                          {pergunta.resposta.texto}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-white/[0.45]">
                          Aguardando resposta…
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Carrossel de perguntas */}
              {id && (
                <QuizPerguntarCard
                  eventoId={id}
                  perguntas={detalhe.perguntasDisponiveis}
                  perguntasAtivas={detalhe.perguntasAtivas}
                  slotsUsados={detalhe.slotsUsados}
                  slotsTotais={detalhe.slotsTotais}
                  trocandoId={trocandoId}
                  onConcluido={aoConcluirQuiz}
                  onCancelarTroca={() => setTrocandoId(null)}
                />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
