import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../../../lib/config";

interface Mensagem {
  id: string;
  conteudo: string;
  nomeAutor: string;
  usuarioId: string;
  horarioEnvio: string;
}

export function useChat(grupoId: string) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conectado, setConectado] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    setMensagens([]);
    setConectado(false);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`, {
        accessTokenFactory: () => token ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on("ReceberMensagem", (mensagem: Mensagem) => {
      if (isMounted) setMensagens((prev) => [...prev, mensagem]);
    });

    connectionRef.current = connection;

    async function inicializar() {
      // Carrega histórico antes de conectar o SignalR para evitar race condition
      const response = await fetch(`${API_URL}/api/Mensagem/${grupoId}/historico`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!isMounted) return;
      if (data.sucesso) {
        setMensagens(
          [...data.dados].sort(
            (a: Mensagem, b: Mensagem) =>
              new Date(a.horarioEnvio).getTime() - new Date(b.horarioEnvio).getTime()
          )
        );
      }

      await connection.start();
      if (!isMounted) { connection.stop(); return; }
      await connection.invoke("EntrarNoGrupo", grupoId);
      if (isMounted) setConectado(true);
    }

    inicializar().catch(() => {
      // ignorado — ocorre no StrictMode quando o componente desmonta durante a negociação
    });

    return () => {
      isMounted = false;
      connection.stop();
    };
  }, [grupoId]);

  async function enviarMensagem(conteudo: string) {
    if (!connectionRef.current || !conectado) return;
    await connectionRef.current.invoke("EnviarMensagem", grupoId, conteudo);
  }

  return { mensagens, enviarMensagem };
}
