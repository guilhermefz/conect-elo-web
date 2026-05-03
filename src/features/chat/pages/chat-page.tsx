import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChatHeader } from "../components/chat-header";
import { MessageBubble } from "../components/message-bubble";
import { ChatInput } from "../components/chat-input";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";

interface Mensagem {
  id: number;
  autor: string;
  conteudo: string;
  horario: string;
  enviada: boolean;
}

const MOCK_MENSAGENS: Mensagem[] = [
  { id: 1, autor: "Ana Silva", conteudo: "Olá pessoal! O sorteio saiu?", horario: "10:31", enviada: false },
  { id: 2, autor: "Eu", conteudo: "Eu já vi o meu! 😊", horario: "10:33", enviada: true },
];

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { nome?: string } };
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>(MOCK_MENSAGENS);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function handleEnviar(texto: string) {
    const nova: Mensagem = {
      id: mensagens.length + 1,
      autor: "Eu",
      conteudo: texto,
      horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      enviada: true,
    };
    setMensagens((prev) => [...prev, nova]);
  }

  return (
    <div className="h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />
      <ChatHeader nome={state?.nome ?? `Grupo ${id}`} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {mensagens.map((msg) => (
          <MessageBubble
            key={msg.id}
            autor={msg.autor}
            conteudo={msg.conteudo}
            horario={msg.horario}
            enviada={msg.enviada}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onEnviar={handleEnviar} />
    </div>
  );
}
