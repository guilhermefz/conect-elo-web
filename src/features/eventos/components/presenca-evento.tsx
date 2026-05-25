import { useState, useRef, useEffect } from "react";
import type { ConfirmacoesEvento } from "../services/evento-service";
import { registrarParticipacao } from "../services/evento-service";

const STATUS = {
  SIM:    { value: 1, label: "✓ Vou!",   base: "border-2 border-transparent text-green-400 bg-white/5 hover:bg-white/10",  selected: "border-2 border-green-500 bg-green-500 text-white" },
  TALVEZ: { value: 3, label: "Talvez",    base: "border-2 border-transparent text-yellow-400 bg-white/5 hover:bg-white/10", selected: "border-2 border-yellow-500 bg-yellow-500 text-white" },
  NAO:    { value: 2, label: "✕ Não vou", base: "border-2 border-transparent text-red-400 bg-white/5 hover:bg-white/10",    selected: "border-2 border-red-500 bg-red-500 text-white" },
};

const STATUS_ICON: Record<number, string> = { 1: "✅", 2: "❌", 3: "😅" };

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function avatarColor(nome: string) {
  const code = nome.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[code];
}

interface Props {
  eventoId: string;
  dados: ConfirmacoesEvento;
}

export function PresencaEvento({ eventoId, dados }: Props) {
  const [minha, setMinha] = useState<number | null>(dados.minhaConfirmacao);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statusAnterior = useRef<number | null>(dados.minhaConfirmacao);

  function confirmar(status: number) {
  if (status === minha) return;
  setMinha(status);
  clearTimeout(timer.current);
  timer.current = setTimeout(async () => {
    try {
      await registrarParticipacao(eventoId, status);
      statusAnterior.current = status;
    } catch {
      setMinha(statusAnterior.current);
    }
  }, 800);
}

useEffect(() => {
  return () => clearTimeout(timer.current);
}, []);

  return (
    <div className="flex flex-col gap-4">
      {/* SUA PRESENÇA */}
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sua Presença</p>
        <div className="flex gap-2">
          {Object.values(STATUS).map(s => (
              <button
                  key={s.value}
                  onClick={() => confirmar(s.value)}
                  className={`flex-1 text-sm font-bold py-2 rounded-full transition-all ${minha === s.value ? s.selected : s.base}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONFIRMADOS */}
      {dados.confirmacoes.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Confirmados ({dados.confirmacoes.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {dados.confirmacoes.map(membro => (
              <div
                key={membro.usuarioId}
                className="flex items-center gap-1.5 bg-white/5 rounded-full px-2 py-1"
              >
                {membro.fotoPerfil ? (
                  <img
                    src={membro.fotoPerfil}
                    alt={membro.nome}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarColor(membro.nome)}`}>
                    {membro.nome[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-gray-300">{membro.nome.split(" ")[0]}</span>
                <span className="text-xs">{STATUS_ICON[membro.status]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}