import { CalendarDaysIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface AmigoSecretoSorteioCardProps {
  dataSorteio?: string;
  ehOrganizador?: boolean;
  onSortear?: () => void;
  carregando?: boolean;
  erro?: string | null;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
}

function diasRestantes(iso: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(iso);
  alvo.setHours(0, 0, 0, 0);

  const diff = Math.ceil((alvo.getTime() - hoje.getTime()) / 86_400_000);
  if (diff < 0) return "Encerrado";
  if (diff === 0) return "Hoje!";
  if (diff === 1) return "Amanhã";
  return `Em ${diff} dias`;
}

export function AmigoSecretoSorteioCard({
  dataSorteio,
  ehOrganizador = false,
  onSortear,
  carregando = false,
  erro = null,
}: AmigoSecretoSorteioCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-surface p-6 text-center">
      <span className="text-4xl" aria-hidden>
        ⌛
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-white">
          Sorteio ainda <span className="text-amber-300">não realizado</span>
        </h3>
        <p className="text-sm text-white/[0.55]">
          {dataSorteio ? (
            <>
              O sorteio acontece em{" "}
              <span className="font-medium capitalize text-white/80">
                {formatarData(dataSorteio)}
              </span>
              . Você vai descobrir quem tirou aqui mesmo.
            </>
          ) : (
            "Assim que o sorteio for realizado, você descobre quem tirou aqui mesmo."
          )}
        </p>
      </div>

      {dataSorteio && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/5 px-3 py-1.5 text-xs font-bold text-white">
          <CalendarDaysIcon className="size-4" />
          {diasRestantes(dataSorteio)}
        </span>
      )}

      {ehOrganizador && (
        <div className="flex w-full flex-col items-center gap-2">
          <button
            type="button"
            onClick={onSortear}
            disabled={carregando}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-[#0b1a14] transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            <SparklesIcon className="size-5" />
            {carregando ? "Processando..." : "Sortear agora"}
          </button>
          {erro ? (
            <p className="text-xs text-rose-400">{erro}</p>
          ) : (
            <p className="text-xs text-white/[0.42]">
              Como organizador, você pode antecipar o sorteio.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
