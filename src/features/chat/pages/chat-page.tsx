import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChatHeader } from "../components/chat-header";
import { MessageBubble } from "../components/message-bubble";
import { ChatInput } from "../components/chat-input";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { useChat } from "../hooks/useChat";
import { getUsuarioIdFromToken } from "../../../lib/jwt"

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { nome?: string } };
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuarioId = getUsuarioIdFromToken() ?? "";
  const { mensagens, conectado, enviarMensagem } = useChat(id!, usuarioId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />
      <ChatHeader nome={state?.nome ?? `Grupo ${id}`} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {mensagens.map((msg) => (
          <MessageBubble
            key={msg.id}
            autor={msg.nomeAutor}
            conteudo={msg.conteudo}
            horario={new Date(msg.horarioEnvio).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            enviada={msg.usuarioId === usuarioId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onEnviar={enviarMensagem} />
    </div>
  );
}
