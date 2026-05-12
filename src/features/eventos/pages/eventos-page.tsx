import { useRef } from "react";

interface Props {
  onMudarAba: (aba: "chat" | "eventos") => void;
}

export function EventosPage({ onMudarAba }: Props) {
  const touchStartX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff < -60) onMudarAba("chat");
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center gap-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <p className="text-4xl">🎉</p>
      <p className="text-white font-bold text-lg">Nenhum evento ainda</p>
      <p className="text-gray-500 text-sm text-center">
        Os eventos do grupo aparecerão aqui.
      </p>
    </div>
  );
}
