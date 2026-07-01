import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "../../../components/toast";
import {
  perguntarQuiz,
  trocarPerguntaQuiz,
  type PerguntaAtiva,
  type PerguntaCatalogo,
} from "../services/amigo-secreto-service";

interface Props {
  eventoId: string;
  perguntas: PerguntaCatalogo[];
  perguntasAtivas: PerguntaAtiva[];
  slotsUsados: number;
  slotsTotais: number;
  /** Quando definido, o card está no modo "trocar" desta pergunta ativa. */
  trocandoId?: string | null;
  onConcluido: () => void;
  onCancelarTroca?: () => void;
}

export function QuizPerguntarCard({
  eventoId,
  perguntas,
  perguntasAtivas,
  slotsUsados,
  slotsTotais,
  trocandoId,
  onConcluido,
  onCancelarTroca,
}: Props) {
  const toast = useToast();
  const [indice, setIndice] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // Mantém o índice válido caso a lista mude de tamanho.
  useEffect(() => {
    setIndice((i) => Math.min(i, Math.max(perguntas.length - 1, 0)));
  }, [perguntas.length]);

  if (perguntas.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-surface p-4 text-sm text-white/[0.55]">
        Nenhuma pergunta disponível no momento.
      </div>
    );
  }

  const atual = perguntas[indice];
  const emTroca = Boolean(trocandoId);
  const jaPerguntada = perguntasAtivas.some((p) => p.perguntaQuizId === atual.id);
  const limiteAtingido = !emTroca && slotsUsados >= slotsTotais;
  const bloqueado = jaPerguntada || limiteAtingido;

  function anterior() {
    setIndice((i) => (i === 0 ? perguntas.length - 1 : i - 1));
  }

  function proxima() {
    setIndice((i) => (i === perguntas.length - 1 ? 0 : i + 1));
  }

  async function handleEnviar() {
    if (bloqueado || enviando) return;
    setEnviando(true);
    try {
      if (emTroca && trocandoId) {
        await trocarPerguntaQuiz(trocandoId, atual.id);
        toast.sucesso("Pergunta trocada.");
      } else {
        await perguntarQuiz(eventoId, atual.id);
        toast.sucesso("Pergunta enviada ao seu amigo secreto.");
      }
      onConcluido();
    } catch {
      toast.erro("Não foi possível enviar a pergunta.");
    } finally {
      setEnviando(false);
    }
  }

  const rotuloBotao = enviando
    ? "Enviando…"
    : jaPerguntada
      ? "Já perguntada"
      : limiteAtingido
        ? `Limite de ${slotsTotais} perguntas`
        : emTroca
          ? "Trocar por esta"
          : "Perguntar";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-surface p-4">
      {/* CABEÇALHO: progresso + navegação */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
          {indice + 1} de {perguntas.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={anterior}
            aria-label="Pergunta anterior"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/[0.7] transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeftIcon className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={proxima}
            aria-label="Próxima pergunta"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/[0.7] transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRightIcon className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {emTroca && (
        <p className="text-xs font-medium text-amber-300">
          Escolha a nova pergunta para substituir.
        </p>
      )}

      {/* PERGUNTA */}
      <h3 className="text-lg font-bold leading-snug text-white">{atual.texto}</h3>

      {/* OPÇÕES (prévia — o recebedor é quem escolhe) */}
      <div className="flex flex-wrap gap-2">
        {atual.opcoes.map((opcao) => (
          <span
            key={opcao.id}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-background px-3 py-2 text-xs font-medium text-white/[0.8]"
          >
            {opcao.emoji && <span className="text-sm leading-none">{opcao.emoji}</span>}
            {opcao.texto}
          </span>
        ))}
      </div>

      {/* AÇÃO */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleEnviar}
          disabled={bloqueado || enviando}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1a14] transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PaperAirplaneIcon className="size-4" strokeWidth={2} />
          {rotuloBotao}
        </button>

        {emTroca && (
          <button
            type="button"
            onClick={onCancelarTroca}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/[0.62] transition-colors hover:bg-white/5"
          >
            Cancelar troca
          </button>
        )}
      </div>
    </div>
  );
}
