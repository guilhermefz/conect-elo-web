import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChatHeader } from "../../chat/components/chat-header";
import { GrupoInfoPanel } from "../../chat/components/grupo-info-panel";
import { GrupoTabs } from "../components/grupo-tabs";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { obterGrupoPorId, buildFotoGrupoUrl, type GrupoDetalhes } from "../services/grupo-service";
import { ToastSucesso } from "../../perfil/components/toast-sucesso";
import { ChatPage } from "../../chat/pages/chat-page";
import { EventosPage } from "../../eventos/pages/eventos-page";

export function GrupoLayout() {
  const { id } = useParams<{ id: string }>();
  const { state, pathname } = useLocation() as {
    state: { nome?: string; sucesso?: boolean };
    pathname: string;
  };
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [detalhes, setDetalhes] = useState<GrupoDetalhes | null>(null);
  const [toast, setToast] = useState<string | null>(
    state?.sucesso ? "Grupo atualizado com sucesso!" : null
  );
  const [abaAtiva, setAbaAtiva] = useState<"chat" | "eventos">(
    pathname.includes("/eventos") ? "eventos" : "chat"
  );

  const nomeGrupo = detalhes?.nome ?? state?.nome ?? "";
  const imgGrupo = useMemo(
    () => (detalhes?.imgGrupo ? buildFotoGrupoUrl(detalhes.imgGrupo) : null),
    [detalhes?.imgGrupo]
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setDetalhes(null);
    obterGrupoPorId(id!)
      .then(setDetalhes)
      .catch(() => {});
  }, [id]);

  return (
    <div className="h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />
      <ToastSucesso mensagem={toast} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ChatHeader
          nome={nomeGrupo || `Grupo ${id}`}
          imgGrupo={imgGrupo}
          onInfoAbrir={() => setInfoAberto(true)}
        />
        <GrupoTabs abaAtiva={abaAtiva} onMudar={setAbaAtiva} />
        <GrupoInfoPanel
          grupoId={id!}
          aberto={infoAberto}
          onFechar={() => setInfoAberto(false)}
          detalhes={detalhes}
        />

        <div className={abaAtiva === "chat" ? "flex flex-1 flex-col overflow-hidden" : "hidden"}>
          <ChatPage onMudarAba={setAbaAtiva} />
        </div>
        <div className={abaAtiva === "eventos" ? "flex flex-1 flex-col overflow-hidden" : "hidden"}>
          <EventosPage onMudarAba={setAbaAtiva} />
        </div>
      </div>
    </div>
  );
}
