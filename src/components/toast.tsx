import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid";

type Variante = "sucesso" | "erro" | "aviso";

interface Props {
  mensagem: string | null;
  variante?: Variante;
}

const config = {
  sucesso: {
    border: "border-emerald-500",
    bg: "bg-emerald-500/20",
    icon: <CheckCircleIcon className="size-5 text-emerald-400" />,
    titulo: "Sucesso",
  },
  erro: {
    border: "border-red-500",
    bg: "bg-red-500/20",
    icon: <XCircleIcon className="size-5 text-red-400" />,
    titulo: "Erro",
  },
  aviso: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/20",
    icon: <ExclamationTriangleIcon className="size-5 text-yellow-400" />,
    titulo: "Aviso",
  },
};

export function Toast({ mensagem, variante = "sucesso" }: Props) {
  if (!mensagem) return null;

  const { border, bg, icon, titulo } = config[variante];

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface border ${border} text-white px-5 py-4 rounded-xl shadow-2xl min-w-72`}>
      <div className={`size-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{titulo}</span>
        <span className="text-xs text-gray-400">{mensagem}</span>
      </div>
    </div>
  );
}
