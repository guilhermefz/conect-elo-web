import { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MessageBubble } from "../components/message-bubble";
import { ChatInput } from "../components/chat-input";
import { useChat } from "../hooks/useChat";
import { getUsuarioIdFromToken } from "../../../lib/jwt";

interface Props {
  onMudarAba: (aba: "chat" | "eventos") => void;
}

export function ChatPage({ onMudarAba }: Props) {
  const { id } = useParams<{ id: string }>();
  const usuarioId = useMemo(() => getUsuarioIdFromToken() ?? "", []);
  const { mensagens, enviarMensagem } = useChat(id!);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (mensagens.length === 0) {
      prevLengthRef.current = 0;
      return;
    }
    const el = scrollContainerRef.current;
    if (!el) return;

    const wasEmpty = prevLengthRef.current === 0;
    prevLengthRef.current = mensagens.length;

    if (wasEmpty) {
      // Carga inicial: vai direto ao final sem animação
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      return;
    }

    // Nova mensagem: só rola se o usuário já estiver perto do final
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 60) onMudarAba("eventos");
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mensagens.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            autor={msg.nomeAutor}
            conteudo={msg.conteudo}
            horario={new Date(msg.horarioEnvio).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            enviada={msg.usuarioId === usuarioId}
            mostrarAutor={index === 0 || mensagens[index - 1].usuarioId !== msg.usuarioId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput onEnviar={enviarMensagem} />
    </div>
  );
}
