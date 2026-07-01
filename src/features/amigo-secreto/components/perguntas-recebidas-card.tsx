import { useState } from "react";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useToast } from "../../../components/toast";
import { responderQuiz, type PerguntaRecebida } from "../services/amigo-secreto-service";

interface Props {
  perguntas: PerguntaRecebida[];
  onRespondeu: () => void;
}

export function PerguntasRecebidasCard({ perguntas, onRespondeu }: Props) {
  const toast = useToast();
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  const total = perguntas.length;
  const respondidas = perguntas.filter((p) => p.opcaoRespostaId).length;
  const pendentes = total - respondidas;
  const progresso = total > 0 ? Math.round((respondidas / total) * 100) : 0;

  async function handleResponder(perguntaId: string, opcaoId: string, jaSelecionada: boolean) {
    if (jaSelecionada || salvandoId) return;
    setSalvandoId(perguntaId);
    try {
      await responderQuiz(perguntaId, opcaoId);
      toast.sucesso("Resposta registrada.");
      onRespondeu();
    } catch {
      toast.erro("Não foi possível registrar a resposta.");
    } finally {
      setSalvandoId(null);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-surface">
      {/* brilho decorativo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 p-4">
        {/* CABEÇALHO */}
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <SparklesIcon className="size-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-white">
                Seu amigo secreto quer te conhecer
              </h2>
              {pendentes > 0 && (
                <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-[#0b1a14]">
                  {pendentes} nova{pendentes > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs leading-[1.5] text-white/[0.55]">
              Responda para ajudar quem vai te presentear. Você pode mudar depois.
            </p>
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-white/[0.5]">
            {respondidas}/{total}
          </span>
        </div>

        {/* PERGUNTAS */}
        <div className="flex flex-col gap-3">
          {perguntas.map((pergunta) => {
            const salvando = salvandoId === pergunta.perguntaAmigoSecretoId;
            const respondida = Boolean(pergunta.opcaoRespostaId);
            return (
              <div
                key={pergunta.perguntaAmigoSecretoId}
                className={`flex flex-col gap-3 rounded-xl border p-3 transition-colors ${
                  respondida
                    ? "border-white/[0.06] bg-background/60"
                    : "border-emerald-500/25 bg-background"
                }`}
              >
                <div className="flex items-center gap-2">
                  {respondida ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[#0b1a14]">
                      <CheckIcon className="size-3" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="size-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                  )}
                  <h3 className="text-sm font-bold text-white">{pergunta.texto}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pergunta.opcoes.map((opcao) => {
                    const selecionada = pergunta.opcaoRespostaId === opcao.id;
                    return (
                      <button
                        key={opcao.id}
                        type="button"
                        disabled={salvando}
                        onClick={() =>
                          handleResponder(pergunta.perguntaAmigoSecretoId, opcao.id, selecionada)
                        }
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-95 disabled:opacity-50 ${
                          selecionada
                            ? "border-emerald-500 bg-emerald-500 text-[#0b1a14] shadow-lg shadow-emerald-500/20"
                            : "border-white/[0.08] bg-surface text-white/[0.8] hover:border-white/20 hover:bg-surface-hover"
                        }`}
                      >
                        {opcao.emoji && <span className="text-sm leading-none">{opcao.emoji}</span>}
                        {opcao.texto}
                        {selecionada && <CheckIcon className="size-3.5" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
