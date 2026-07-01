import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { Interesse } from "../services/perfil-service";

interface Props {
  interesses: Interesse[];
  onEditar: () => void;
}

export function InteressesSecao({ interesses, onEditar }: Props) {
  return (
    <button type="button" onClick={onEditar} className="w-full text-left">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Interesses</p>
      <div className="flex items-center justify-between gap-3 bg-surface rounded-xl px-4 py-3 hover:bg-surface-hover transition-colors">
        <span className={`text-sm ${interesses.length ? "text-gray-200" : "text-gray-500"}`}>
          {interesses.length
            ? interesses.map((i) => i.nome).join(", ")
            : "Adicione seus interesses"}
        </span>
        <ChevronRightIcon className="size-5 text-gray-500 shrink-0" />
      </div>
    </button>
  );
}
