import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Mensagem {
    id: string;
    conteudo: string;
    nomeAutor:string;
    usuarioId: string;
    horarioEnvio: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function useChat(grupoId: string, usuarioId: string) {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [conectado, setConectado] = useState(false);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // Busca histórico via REST ao abrir o chat
    useEffect(() => {
        async function carregarHistorico() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/Mensagem/${grupoId}/historico`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.sucesso) setMensagens(data.dados);
        }

        carregarHistorico();
    }, [grupoId]);

    // Conecta ao Hub SignalR
    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("token");

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

        connection.start()
            .then(async () => {
                if (!isMounted) return;
                await connection.invoke("EntrarNoGrupo", grupoId);
                setConectado(true);
            })
            .catch(() => {
                // Ignorado — ocorre no StrictMode quando o componente desmonta durante a negociação
            });

        return () => {
            isMounted = false;
            connection.stop();
        };
    }, [grupoId]);

    async function enviarMensagem(conteudo:string) {
        if (!connectionRef.current || !conectado) return;
        await connectionRef.current.invoke("EnviarMensagem", grupoId, conteudo);
    }

    return { mensagens, conectado, enviarMensagem };

}