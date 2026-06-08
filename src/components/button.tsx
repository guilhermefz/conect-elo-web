interface Props {
  variante?: "primary" | "danger" | "outline";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const variantes = {
  primary: "bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600",
  danger:  "bg-red-400 text-white hover:bg-red-500 active:bg-red-600",
  outline: "border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10",
};

export function Button({ variante = "primary", className = "", children, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 font-bold uppercase tracking-widest rounded-full px-6 py-2.5 text-xs transition-colors disabled:opacity-50 ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  );
}