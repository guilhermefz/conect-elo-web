import { useEffect, useState } from "react";
import { API_URL } from "../../../lib/config";
import { useSignalR } from "../../../hooks/signalr-context";

interface Mensagem {
  id: string;
  conteudo: string;
  nomeAutor: string;
  usuarioId: string;
  horarioEnvio: string;
}

export function useChat(grupoId: string) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const { connection, conectado } = useSignalR()
  const [noGrupo, setNoGrupo] = useState(false)

  useEffect(() => {
    if (!connection || !conectado) return
    const conn = connection
    let isMounted = true

    conn.on("ReceberMensagem", (mensagem: Mensagem) => {
      if (isMounted) setMensagens(prev => [...prev, mensagem])
    })


    async function inicializar() {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/Mensagem/${grupoId}/historico`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (!isMounted) return
      if (data.sucesso) {
        setMensagens([...data.dados].sort(
          (a, b) => new Date(a.horarioEnvio).getTime() - new Date(b.horarioEnvio).getTime()
        ))
      }

      await conn.invoke("EntrarNoGrupo", grupoId)
      if (isMounted) setNoGrupo(true)
    }

    inicializar().catch(console.error)

    return () => {
      isMounted = false
      conn.off("ReceberMensagem")
      conn.invoke("SairDoGrupo", grupoId).catch(() => {})
      setNoGrupo(false)
    }
  }, [connection, conectado, grupoId])

  async function enviarMensagem(conteudo: string) {
    if (!connection || !noGrupo) return
    await connection.invoke("EnviarMensagem", grupoId, conteudo)
  }

  return { mensagens, enviarMensagem }
}
