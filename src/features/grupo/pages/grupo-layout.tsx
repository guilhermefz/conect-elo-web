import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ChatHeader } from "../../chat/components/chat-header";
import { GrupoInfoPanel } from "../../chat/components/grupo-info-panel";
import { GrupoTabs } from "../components/grupo-tabs";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { obterGrupoPorId, buildFotoGrupoUrl, type GrupoDetalhes } from "../services/grupo-service";
import { useToast } from "../../../components/toast";
import { ChatPage } from "../../chat/pages/chat-page";
import { EventosPage } from "../../eventos/pages/eventos-page";

export function GrupoLayout() {
  const { id } = useParams<{ id: string }>();
  const { state, pathname } = useLocation() as {
    state: { nome?: string; sucesso?: boolean };
    pathname: string;
  };
  const logout = useLogout();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [infoAberto, setInfoAberto] = useState(false);
  const [detalhes, setDetalhes] = useState<GrupoDetalhes | null>(null);
  const toast = useToast();
  const [abaAtiva, setAbaAtiva] = useState<"chat" | "eventos">(
    pathname.includes("/eventos") ? "eventos" : "chat"
  );

  const nomeGrupo = detalhes?.nome ?? state?.nome ?? "";
  const imgGrupo = useMemo(
    () => (detalhes?.imgGrupo ? buildFotoGrupoUrl(detalhes.imgGrupo) : null),
    [detalhes?.imgGrupo]
  );
  const fotosPorUsuario = useMemo(() => {
    const mapa: Record<string, string> = {};
    for (const m of detalhes?.membros ?? []) {
      if (m.fotoPerfilUrl) mapa[m.usuarioId] = m.fotoPerfilUrl;
    }
    return mapa;
  }, [detalhes?.membros]);

  useEffect(() => {
    if (location.state?.mensagem) {
      toast.sucesso(location.state.mensagem);
    }
  }, []);

  useEffect(() => {
    setDetalhes(null);
    obterGrupoPorId(id!)
      .then(setDetalhes)
      .catch(() => {});
  }, [id]);

  return (
    <div className="h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />
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
          onFotoAtualizada={(novaUrl) =>
            setDetalhes((d) => (d ? { ...d, imgGrupo: novaUrl } : d))
          }
        />

        <div className={abaAtiva === "chat" ? "flex flex-1 flex-col overflow-hidden" : "hidden"}>
          <ChatPage onMudarAba={setAbaAtiva} fotosPorUsuario={fotosPorUsuario} />
        </div>
        <div className={abaAtiva === "eventos" ? "flex flex-1 flex-col overflow-hidden" : "hidden"}>
          <EventosPage onMudarAba={setAbaAtiva} />
        </div>
      </div>
    </div>
  );
}
