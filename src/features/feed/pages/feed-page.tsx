import { useState, useEffect } from "react";
import { PostagemForm } from "../components/postagem-form";
import { PostCard } from "../components/post-card";
import { GrupoSelector } from "../components/grupo-selector";
import { MenuLateral } from "../../../components/menu-lateral";
import { Navbar } from "../../../components/navbar";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { buscarGruposDoUsuario } from "../../grupo/services/grupo-service";
import type { GrupoResumo } from "../../grupo/services/grupo-service";
import { obterFeed } from "../services/post-service";
import type { FeedPostagemDto } from "../services/post-service";
import { useLogout } from "../../../hooks/useLogout";

export const FeedPage = () => {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [grupos, setGrupos] = useState<GrupoResumo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoResumo | null>(null);
  const [posts, setPosts] = useState<FeedPostagemDto[]>([]);
  const usuarioId = getUsuarioIdFromToken() ?? "";

  useEffect(() => {
    buscarGruposDoUsuario(usuarioId)
      .then((data) => {
        setGrupos(data);
        if (data.length > 0) setGrupoSelecionado(data[0]);
      })
      .catch((err) => console.error("Erro ao buscar grupos:", err));
  }, [usuarioId]);

  function carregarFeed() {
    if (!usuarioId) return;
    obterFeed(usuarioId)
      .then(setPosts)
      .catch((err) => console.error("Erro ao carregar feed:", err));
  }

  useEffect(() => {
    carregarFeed();
  }, [usuarioId]);

  return (
    <div className="min-h-screen bg-[#12111a]">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Murais" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4">
        <div className="mx-auto max-w-xl rounded-2xl bg-gray-800 px-4 py-3 flex flex-col gap-3">
          <GrupoSelector
            grupos={grupos}
            selecionado={grupoSelecionado}
            onSelecionar={setGrupoSelecionado}
          />

          {grupoSelecionado && (
            <PostagemForm usuarioId={usuarioId} muralId={grupoSelecionado.muralId} onPostar={carregarFeed} />
          )}

          {grupos.length === 0 && (
            <p className="text-sm text-gray-400">Você não participa de nenhum grupo ainda.</p>
          )}
        </div>
      </div>

      <main className="p-4 flex flex-col gap-3">
        {posts.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-6">Nenhuma postagem ainda.</p>
        )}
        {posts.map((post) => {
          const grupo = grupos.find((g) => g.muralId === post.muralId);
          return <PostCard key={post.id} post={{ ...post, nomeGrupo: grupo?.nome ?? post.nomeGrupo }} />;
        })}
      </main>
    </div>
  );
};
