import { BellIcon, GiftIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import type { NotificacaoDto } from "../services/avisos-service"

interface Props {
  aviso: NotificacaoDto
}

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `Há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Há ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return "Ontem"
  return `Há ${d} dias`
}

export function AvisoCard({ aviso }: { aviso: NotificacaoDto }) {
  const navigate = useNavigate()
  const icone = aviso.linkUrl
    ? <GiftIcon className="size-5 text-white" />
    : <BellIcon className={`size-5 ${aviso.notificacaoLida ? "text-gray-400" : "text-white"}`} />

  return (
    <div className={`flex items-start gap-4 rounded-2xl p-4 transition-colors ${
      aviso.notificacaoLida ? "bg-surface" : "bg-surface border border-emerald-500"
    }`}>
      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
        aviso.notificacaoLida ? "bg-gray-700" : "bg-emerald-500"
      }`}>
        <BellIcon className={`size-5 ${aviso.notificacaoLida ? "text-gray-400" : "text-white"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${aviso.notificacaoLida ? "text-gray-400" : "text-white font-bold"}`}>
          {aviso.conteudo}
        </p>
        <p className="text-emerald-500 text-xs font-semibold mt-1 uppercase tracking-wider">
          {tempoRelativo(aviso.dataEnvio)}
        </p>
        {aviso.linkUrl && (
          <button
            onClick={() => navigate(aviso.linkUrl)}
            className="mt-3 flex items-center gap-2 border border-emerald-500 text-emerald-400 text-xs font-semibold rounded-lg px-3 py-1.5 hover:bg-emerald-500/10 transition-colors"
          >
            🎂 Ver evento →
          </button>
        )}
      </div>
    </div>
  )
}