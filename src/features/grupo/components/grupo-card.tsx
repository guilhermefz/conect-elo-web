interface Props {
  nome: string;
  ultimaMensagem?: string;
  horario?: string;
  onClick: () => void;
}

export function GrupoCard({ nome, ultimaMensagem = "Nenhuma mensagem ainda.", horario = "Agora", onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 bg-[#1e1b2e] rounded-2xl p-4 text-left hover:bg-[#252236] transition-colors w-full"
    >
      <div className="size-14 rounded-xl bg-gray-700 shrink-0 flex items-center justify-center text-2xl">
        🤝
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm">{nome}</p>
        <p className="text-gray-400 text-xs italic truncate mt-0.5">"{ultimaMensagem}"</p>
      </div>
      <span className="text-green-500 text-xs font-semibold shrink-0">{horario}</span>
    </button>
  );
}
