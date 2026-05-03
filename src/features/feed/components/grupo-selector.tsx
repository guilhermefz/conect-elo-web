import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import type { GrupoResumo } from "../../grupo/services/grupo-service";

interface Props {
  grupos: GrupoResumo[];
  selecionado: GrupoResumo | null;
  onSelecionar: (grupo: GrupoResumo) => void;
}

export function GrupoSelector({ grupos, selecionado, onSelecionar }: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="flex items-center gap-1 text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
      >
        {selecionado?.nome ?? "Escolha um grupo"}
        <ChevronDownIcon className="size-3" />
      </button>

      {aberto && (
        <ul className="absolute left-0 top-full mt-2 min-w-48 rounded-xl bg-gray-700 border border-gray-600 shadow-xl overflow-hidden z-10">
          {grupos.map((grupo) => (
            <li
              key={grupo.id}
              onClick={() => { onSelecionar(grupo); setAberto(false); }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 transition-colors ${selecionado?.id === grupo.id ? "text-green-400 font-semibold" : "text-white"}`}
            >
              {grupo.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
