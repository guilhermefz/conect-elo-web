import { useRef, useState, type ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  variante?: "centro" | "bottom-sheet";
}

function BottomSheet({ titulo, onFechar, children }: Omit<Props, "variante">) {
  const [alturaVh, setAlturaVh] = useState(80);
  const drag = useRef<{ startY: number; startAltura: number } | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    drag.current = { startY: e.touches[0].clientY, startAltura: alturaVh };
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!drag.current) return;
    const deltaVh = ((drag.current.startY - e.touches[0].clientY) / window.innerHeight) * 100;
    setAlturaVh(Math.min(95, Math.max(15, drag.current.startAltura + deltaVh)));
  }

  function onTouchEnd() {
    if (alturaVh < 30) onFechar();
    drag.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end backdrop-blur-sm bg-black/50"
      onClick={onFechar}
    >
      <div
        className="bg-surface rounded-t-3xl flex flex-col"
        style={{ height: `${alturaVh}vh` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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

export function Modal({ titulo, onFechar, children, variante = "centro" }: Props) {
  if (variante === "bottom-sheet") {
    return <BottomSheet titulo={titulo} onFechar={onFechar}>{children}</BottomSheet>;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
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