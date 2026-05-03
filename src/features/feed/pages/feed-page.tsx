import { useState, useEffect } from "react";
import { PostagemForm } from "../components/postagem-form";
import { GrupoSelector } from "../components/grupo-selector";
import { MenuLateral } from "../../../components/menu-lateral";
import { Navbar } from "../../../components/navbar";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { buscarGruposDoUsuario } from "../../grupo/services/grupo-service";
import type { GrupoResumo } from "../../grupo/services/grupo-service";
import { useLogout } from "../../../hooks/useLogout";

const posts = [
  { id: 1, autor: "Guilherme", conteudo: "Primeiro post do ConectElo!" },
  { id: 2, autor: "Admin", conteudo: "Sistema de feed validado." },
];

export const FeedPage = () => {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [grupos, setGrupos] = useState<GrupoResumo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoResumo | null>(null);
  const usuarioId = getUsuarioIdFromToken() ?? "";

  useEffect(() => {
    buscarGruposDoUsuario(usuarioId)
      .then((data) => {
        setGrupos(data);
        if (data.length > 0) setGrupoSelecionado(data[0]);
      })
      .catch((err) => console.error("Erro ao buscar grupos:", err));
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
            <PostagemForm usuarioId={usuarioId} muralId={grupoSelecionado.muralId} />
          )}

          {grupos.length === 0 && (
            <p className="text-sm text-gray-400">Você não participa de nenhum grupo ainda.</p>
          )}
        </div>
      </div>

      <main className="p-4 flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-gray-800 p-4">
            <strong className="text-white text-sm">{post.autor}</strong>
            <p className="text-gray-400 text-sm mt-1">{post.conteudo}</p>
          </div>
        ))}
      </main>
    </div>
  );
};
