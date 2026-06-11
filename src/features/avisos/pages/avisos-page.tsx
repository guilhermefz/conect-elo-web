import { useState, useEffect, useCallback } from "react"
import { CheckIcon } from "@heroicons/react/24/outline"
import { Navbar } from "../../../components/navbar"
import { MenuLateral } from "../../../components/menu-lateral"
import { useLogout } from "../../../hooks/useLogout"
import { AvisoCard } from "../components/aviso-card"
import { AvisosTabs, type AbaAvisos } from "../components/aviso-tabs"
import { listarAvisos, marcarComoLido, marcarTodasComoLidas, type NotificacaoDto } from "../services/avisos-service"
import { useAvisosSignalR } from "../hooks/useAvisosSignalR"

export function AvisosPage() {
  const logout = useLogout()
  const [menuAberto, setMenuAberto] = useState(false)
  const [avisos, setAvisos] = useState<NotificacaoDto[]>([])
  const [aba, setAba] = useState<AbaAvisos>("todos")

  useEffect(() => {
    listarAvisos().then(setAvisos).catch(console.error)
  }, [])

  const onNovoAviso = useCallback((aviso: NotificacaoDto) => {
    setAvisos(prev => [aviso, ...prev])
  }, [])

  useAvisosSignalR(onNovoAviso)

  const naoLidos = avisos.filter(a => !a.notificacaoLida)

  const avisosExibidos =
    aba === "nao-lidos" ? naoLidos
    : aba === "lidos" ? avisos.filter(a => a.notificacaoLida)
    : avisos

  async function handleMarcarLido(id: string) {
    await marcarComoLido(id)
    setAvisos(prev => prev.map(a => a.id === id ? { ...a, notificacaoLida: true } : a))
  }

  async function handleMarcarTodas() {
    await marcarTodasComoLidas()
    setAvisos(prev => prev.map(a => ({ ...a, notificacaoLida: true })))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-black text-xl uppercase tracking-widest">Avisos</h1>
            {naoLidos.length > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                {naoLidos.length}
              </span>
            )}
          </div>

          {naoLidos.length > 0 && (
            <button
              onClick={handleMarcarTodas}
              className="flex items-center gap-1 text-emerald-500 text-sm font-semibold hover:text-emerald-400 transition-colors"
            >
              <CheckIcon className="size-4" />
              Marcar todas
            </button>
          )}
        </div>

        <AvisosTabs aba={aba} totalNaoLidos={naoLidos.length} onChange={setAba} />

        <div className="flex flex-col gap-3">
          {avisosExibidos.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">Nenhum aviso por aqui.</p>
          ) : (
            avisosExibidos.map(aviso => (
              <AvisoCard key={aviso.id} aviso={aviso} onClick={handleMarcarLido} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}