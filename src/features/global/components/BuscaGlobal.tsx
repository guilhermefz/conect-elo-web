import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props {
  valor?: string;
  onChange?: (v: string) => void;
  onFocus?: () => void;
  placeholder?: string;
}

export function BuscaGlobal({
  valor = "",
  onChange,
  onFocus,
  placeholder = "Buscar eventos, lugares, temas...",
}: Props) {
  return (
    <div className="relative px-4">
      <MagnifyingGlassIcon className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/10 bg-surface pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
      />
    </div>
  );
}
