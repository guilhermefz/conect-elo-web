import { useEffect } from "react"
import type { NotificacaoDto } from "../services/avisos-service"
import { useSignalR } from "../../../hooks/signalr-context"

export function useAvisosSignalR(onAviso: (aviso: NotificacaoDto) => void) {
  const { connection, conectado } = useSignalR()

  useEffect(() => {
    if (!connection || !conectado) return

    connection.on("ReceberAviso", onAviso)

    return () => {
      connection.off("ReceberAviso", onAviso)
    }
  }, [connection, conectado, onAviso])
}