import { BellIcon } from "@heroicons/react/24/outline";

export interface Aviso {
  id: number;
  mensagem: string;
  tempo: string;
  lido: boolean;
}

interface Props {
  aviso: Aviso;
}

export function AvisoCard({ aviso }: Props) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-4 transition-colors ${
      aviso.lido
        ? "bg-[#1e1b2e]"
        : "bg-[#1e1b2e] border border-emerald-500"
    }`}>
      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
        aviso.lido ? "bg-gray-700" : "bg-emerald-500"
      }`}>
        <BellIcon className={`size-5 ${aviso.lido ? "text-gray-400" : "text-white"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${aviso.lido ? "text-gray-400" : "text-white font-bold"}`}>
          {aviso.mensagem}
        </p>
        <p className="text-emerald-500 text-xs font-semibold mt-1 uppercase tracking-wider">
          {aviso.tempo}
        </p>
      </div>
    </div>
  );
}
