import type { ReactNode } from "react";
import { useArrastarParaRolar } from "../hooks/use-arrastar-para-rolar";

interface Props {
  children: ReactNode;
}

export function CarrosselHorizontal({ children }: Props) {
  const ref = useArrastarParaRolar();
  return (
    <div
      ref={ref}
      className="flex gap-3 overflow-x-auto scrollbar-none cursor-grab select-none snap-x snap-mandatory pb-1"
    >
      {children}
    </div>
  );
}
