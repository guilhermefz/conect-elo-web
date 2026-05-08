import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChatHeader } from "../components/chat-header";
import { MessageBubble } from "../components/message-bubble";
import { ChatInput } from "../components/chat-input";
import { GrupoInfoPanel } from "../components/grupo-info-panel";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { useChat } from "../hooks/useChat";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { obterGrupoPorId, buildFotoGrupoUrl } from "../../grupo/services/grupo-service";

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { nome?: string } };
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState(state?.nome ?? "");
  const [imgGrupo, setImgGrupo] = useState<string | null>(null);
  const usuarioId = getUsuarioIdFromToken() ?? "";
  const { mensagens, enviarMensagem } = useChat(id!, usuarioId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    obterGrupoPorId(id!)
      .then((d) => {
        setNomeGrupo(d.nome);
        setImgGrupo(d.imgGrupo ? buildFotoGrupoUrl(d.imgGrupo) : null);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ChatHeader nome={nomeGrupo || `Grupo ${id}`} imgGrupo={imgGrupo} onInfoAbrir={() => setInfoAberto(true)} />
        <GrupoInfoPanel grupoId={id!} aberto={infoAberto} onFechar={() => setInfoAberto(false)} />

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
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
    </div>
  );
}
