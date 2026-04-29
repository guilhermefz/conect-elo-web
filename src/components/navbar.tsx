interface Props {
  titulo: string;
  onMenuAbrir: () => void;
}

export function Navbar({ titulo, onMenuAbrir }: Props) {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-[#12111a]">
      <button onClick={onMenuAbrir} className="text-white text-xl">
        ☰
      </button>
      <span className="text-white font-bold uppercase tracking-widest text-sm">{titulo}</span>
      <div className="size-9 rounded-full bg-green-500 flex items-center justify-center text-base select-none">
        🤝
      </div>
    </nav>
  );
}
