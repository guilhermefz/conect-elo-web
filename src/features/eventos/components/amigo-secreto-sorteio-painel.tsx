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
      const eventoAtualizado = {
        ...evento,
        sorteado: true,
        dataExecucaoSorteio: new Date().toISOString(),
        statusSorteio: 2, // Sorteado
      };
      onSorteioExecutado(eventoAtualizado);
    } catch {
      setErro("Erro ao realizar o sorteio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleAlterarData() {
    if (!novaData) {
      setErro("Por favor, selecione uma data válida.");
      return;
    }

    const data = new Date(novaData);
    const agora = new Date();

    if (isNaN(data.getTime())) {
      setErro("Data inválida.");
      return;
    }

    if (data <= agora) {
      setErro("A data deve ser no futuro.");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const isoString = data.toISOString();
      await alterarDataSorteio(evento.id, isoString);
      const eventoAtualizado = {
        ...evento,
        dataSorteio: isoString,
      };
      onSorteioExecutado(eventoAtualizado);
      setMostrando(false);
    } catch (e) {
      console.error("Erro ao alterar data:", e);
      setErro("Erro ao alterar a data do sorteio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (sorteadoJa) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
        <span className="text-xl">✅</span>
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Sorteio realizado em</p>
          <p className="text-green-400 text-sm">{evento.dataExecucaoSorteio ? formatarData(evento.dataExecucaoSorteio) : "Data indisponível"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {temDataAgendada && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <span className="text-xl">⏰</span>
          <div className="flex-1">
            <p className="text-gray-500 text-xs mb-0.5">Sorteio agendado para</p>
            <p className="text-blue-400 text-sm">{formatarData(evento.dataSorteio!)}</p>
          </div>
        </div>
      )}

      {erro && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <span className="text-xl">⚠️</span>
          <p className="text-red-400 text-sm">{erro}</p>
        </div>
      )}

      {!mostrando ? (
        <div className="flex gap-2">
          <button
            onClick={handleSortearAgora}
            disabled={carregando}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            {carregando ? "Processando..." : "Sortear agora"}
          </button>
          <button
            onClick={() => setMostrando(true)}
            disabled={carregando}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm disabled:opacity-50 hover:bg-white/20 transition-colors"
          >
            Alterar data
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold">Nova data do sorteio</label>
            <input
              type="datetime-local"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAlterarData}
              disabled={carregando}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {carregando ? "Salvando..." : "Confirmar"}
            </button>
            <button
              onClick={() => {
                setMostrando(false);
                setErro(null);
              }}
              disabled={carregando}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold text-sm disabled:opacity-50 hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
