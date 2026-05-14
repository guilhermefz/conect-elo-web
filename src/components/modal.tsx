import type { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  variante?: "centro" | "bottom-sheet";
}

export function Modal({ titulo, onFechar, children, variante = "centro" }: Props) {
  if (variante === "bottom-sheet") {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-sm bg-black/50"
        onClick={onFechar}
      >
        <div
          className="bg-[#1e1b2e] rounded-t-3xl flex flex-col"
          style={{ maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <h2 className="text-white font-bold text-base">{titulo}</h2>
            <button onClick={onFechar} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1b2e] rounded-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{titulo}</h2>
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
