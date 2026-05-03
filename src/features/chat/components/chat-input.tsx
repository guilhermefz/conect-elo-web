import { useState } from "react";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface Props {
  onEnviar: (mensagem: string) => void;
}

export function ChatInput({ onEnviar }: Props) {
  const [texto, setTexto] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    onEnviar(texto.trim());
    setTexto("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 bg-[#12111a] border-t border-[#1e1b2e]">
      <button type="button" className="text-gray-500 hover:text-gray-300 transition-colors shrink-0">
        <PhotoIcon className="size-6" />
      </button>

      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva..."
        className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
      />

      <button
        type="submit"
        className="size-9 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-colors shrink-0"
      >
        <PaperAirplaneIcon className="size-4" />
      </button>
    </form>
  );
}
