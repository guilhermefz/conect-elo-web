import { conversasAnonimas } from "../data/mock";

interface Props {
  onAbrir: (id: string) => void;
}

export function ListaConversasAnonimas({ onAbrir }: Props) {
  return (
    <>
      <div className="flex items-center gap-4 bg-surface rounded-2xl p-4">
        <div className="size-12 rounded-xl bg-blue-500/20 shrink-0 flex items-center justify-center text-2xl">
          🎭
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm">Conversas anônimas</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Chats do amigo secreto — sua identidade fica protegida.
          </p>
        </div>
      </div>

      {conversasAnonimas.map((conversa) => (
        <button
          key={conversa.id}
          onClick={() => onAbrir(conversa.id)}
          className="flex items-center gap-4 bg-surface rounded-2xl p-4 text-left hover:bg-surface-hover transition-colors w-full"
        >
          <div className="size-12 rounded-xl bg-orange-500/20 shrink-0 flex items-center justify-center text-2xl">
            {conversa.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{conversa.titulo}</p>
            <p className="text-gray-400 text-xs mt-0.5 truncate">{conversa.ultimaMensagem}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-gray-500 text-[10px]">{conversa.horario}</span>
            {conversa.naoLidas > 0 && (
              <span className="size-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                {conversa.naoLidas}
              </span>
            )}
          </div>
        </button>
      ))}
    </>
  );
}
