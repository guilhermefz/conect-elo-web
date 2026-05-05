import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  visivel: boolean;
}

export function ToastSucesso({ visivel }: Props) {
  if (!visivel) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1e1b2e] border border-emerald-500 text-white px-5 py-4 rounded-xl shadow-2xl min-w-72">
      <div className="size-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
        <CheckCircleIcon className="size-5 text-emerald-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">Sucesso</span>
        <span className="text-xs text-gray-400">Perfil atualizado com sucesso!</span>
      </div>
    </div>
  );
}
