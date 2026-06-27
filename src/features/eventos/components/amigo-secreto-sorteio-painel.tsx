import { useState } from "react";
import { sortearAgora, alterarDataSorteio, type ExibirEvento } from "../services/evento-service";

interface AmigoSecretoSorteiosPainelProps {
  evento: ExibirEvento;
  onSorteioExecutado: (eventoAtualizado: ExibirEvento) => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatarDataInput(iso?: string): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const ano = date.getUTCFullYear();
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(date.getUTCDate()).padStart(2, "0");
    const hora = String(date.getUTCHours()).padStart(2, "0");
    const minuto = String(date.getUTCMinutes()).padStart(2, "0");
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  } catch {
    return "";
  }
}

export function AmigoSecretoSorteiosPainel({ evento, onSorteioExecutado }: AmigoSecretoSorteiosPainelProps) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrando, setMostrando] = useState(false);
  const [novaData, setNovaData] = useState(formatarDataInput(evento.dataSorteio));

  const sorteadoJa = evento.sorteado;
  const temDataAgendada = evento.dataSorteio && !sorteadoJa;

  async function handleSortearAgora() {
    if (!confirm("Tem certeza que deseja realizar o sorteio agora?")) return;
    setCarregando(true);
    setErro(null);
    try {
      await sortearAgora(evento.id);
      onSorteioExecutado({
        ...evento,
        sorteado: true,
        dataExecucaoSorteio: new Date().toISOString(),
        statusSorteio: 2,
      });
    } catch {
      setErro("Erro ao realizar o sorteio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleAlterarData() {
    if (!novaData) { setErro("Por favor, selecione uma data válida."); return; }
    const data = new Date(novaData);
    if (isNaN(data.getTime())) { setErro("Data inválida."); return; }
    if (data <= new Date()) { setErro("A data deve ser no futuro."); return; }
    setCarregando(true);
    setErro(null);
    try {
      const isoString = data.toISOString();
      await alterarDataSorteio(evento.id, isoString);
      onSorteioExecutado({ ...evento, dataSorteio: isoString });
      setMostrando(false);
    } catch {
      setErro("Erro ao alterar a data do sorteio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (sorteadoJa) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <span className="text-xl">✅</span>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/[0.42] mb-0.5">
            Sorteio realizado em
          </p>
          <p className="text-sm font-medium text-emerald-400 capitalize">
            {evento.dataExecucaoSorteio ? formatarData(evento.dataExecucaoSorteio) : "Data indisponível"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {temDataAgendada && (
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-surface p-4">
          <span className="text-xl">⏰</span>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/[0.42] mb-0.5">
              Sorteio agendado para
            </p>
            <p className="text-sm font-medium text-emerald-400 capitalize">
              {formatarData(evento.dataSorteio!)}
            </p>
          </div>
        </div>
      )}

      {erro && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-rose-400">{erro}</p>
        </div>
      )}

      {!mostrando ? (
        <div className="flex gap-2">
          <button
            onClick={handleSortearAgora}
            disabled={carregando}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#0b1a14] hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {carregando ? "Processando..." : "Sortear agora"}
          </button>
          <button
            onClick={() => setMostrando(true)}
            disabled={carregando}
            className="flex-1 rounded-full border border-white/[0.07] bg-surface px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Alterar data
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-surface p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/[0.42]">
              Nova data do sorteio
            </label>
            <input
              type="datetime-local"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAlterarData}
              disabled={carregando}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0b1a14] hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {carregando ? "Salvando..." : "Confirmar"}
            </button>
            <button
              onClick={() => { setMostrando(false); setErro(null); }}
              disabled={carregando}
              className="flex-1 rounded-full border border-white/[0.07] bg-surface px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
