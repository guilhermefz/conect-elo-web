import { useState, useEffect, useCallback } from "react"
import { Navbar } from "../../../components/navbar"
import { MenuLateral } from "../../../components/menu-lateral"
import { useLogout } from "../../../hooks/useLogout"
import { AvisoCard } from "../components/aviso-card"
import { listarAvisos, type NotificacaoDto } from "../services/avisos-service"
import { useAvisosSignalR } from "../hooks/useAvisosSignalR"

export function AvisosPage() {
  const logout = useLogout()
  const [menuAberto, setMenuAberto] = useState(false)
  const [avisos, setAvisos] = useState<NotificacaoDto[]>([])

  useEffect(() => {
    listarAvisos().then(setAvisos).catch(console.error)
  }, [])

  const onNovoAviso = useCallback((aviso: NotificacaoDto) => {
    setAvisos(prev => [aviso, ...prev])
  }, [])

  useAvisosSignalR(onNovoAviso)

  const naoLidos = avisos.filter(a => !a.notificacaoLida).length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-black text-xl uppercase tracking-widest">Avisos</h1>
          {naoLidos > 0 && (
            <span className="bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {naoLidos}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {avisos.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">Nenhum aviso por enquanto.</p>
          ) : (
            avisos.map(aviso => <AvisoCard key={aviso.id} aviso={aviso} />)
          )}
        </div>
      </div>
    </div>
  )
}