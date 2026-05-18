interface Props {
  nome: string;
  fotoUrl?: string | null;
  onClick: () => void;
}

export function GrupoCard({ nome, fotoUrl, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 bg-[#1e1b2e] rounded-2xl p-4 text-left hover:bg-[#252236] transition-colors w-full"
    >
      <div className="size-14 rounded-xl bg-gray-700 shrink-0 overflow-hidden flex items-center justify-center text-2xl">
        {fotoUrl
          ? <img src={fotoUrl} alt={nome} className="size-full object-cover" />
          : <span>🤝</span>
        }
      </div>
      <p className="flex-1 min-w-0 text-white font-bold text-sm truncate">{nome}</p>
    </button>
  );
}
