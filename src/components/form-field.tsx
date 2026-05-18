import type { ReactNode } from "react";

interface Props {
  label: string;
  erro?: string;
  children: ReactNode;
}

export function FormField({ label, erro, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
      {erro && <p className="text-red-400 text-xs">{erro}</p>}
    </div>
  );
}
