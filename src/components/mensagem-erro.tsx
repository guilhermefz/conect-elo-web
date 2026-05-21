import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface Props {
  texto: string
  onFechar?: () => void
}

export function MensagemErro({ texto, onFechar }: Props) {
  return (
    <div className="flex items-center gap-3 bg-surface border border-red-500 rounded-2xl p-4">
      <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
        <ExclamationTriangleIcon className="size-5 text-red-400" />
      </div>
      <p className="text-red-400 text-sm flex-1">{texto}</p>
      {onFechar && (
        <button onClick={onFechar} className="text-gray-500 hover:text-white transition-colors shrink-0">
          <XMarkIcon className="size-4" />
        </button>
      )}
    </div>
  )
}
