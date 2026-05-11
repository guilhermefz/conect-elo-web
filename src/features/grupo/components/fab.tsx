import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Opcao {
  label: string;
  rota?: string;
  onClick?: () => void;
}

interface Props {
  opcoes: Opcao[];
}

export function Fab({ opcoes }: Props) {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  function handleClick(opcao: Opcao) {
    setAberto(false);
    if (opcao.onClick) opcao.onClick();
    else if (opcao.rota) navigate(opcao.rota);
  }

  return (
    <div className="fixed bottom-10 right-8 flex flex-col items-end gap-2 z-50">
      {aberto && (
        <div className="flex flex-col items-end gap-2 mb-1">
          {opcoes.map((opcao) => (
            <button
              key={opcao.label}
              onClick={() => handleClick(opcao)}
              className="bg-[#1e1b2e] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-[#252236] transition-colors whitespace-nowrap"
            >
              {opcao.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setAberto((v) => !v)}
        className="size-12 rounded-full bg-emerald-500 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-emerald-400 transition-colors"
        aria-label="Abrir opções"
      >
        {aberto ? "×" : "+"}
      </button>
    </div>
  );
}
