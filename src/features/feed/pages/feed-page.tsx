import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { PostagemForm } from "../components/postagem-form";
import { MenuLateral } from "../components/menu-lateral";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { buscarGruposDoUsuario } from "../../grupo/services/grupo-service";
import type { GrupoResumo } from "../../grupo/services/grupo-service";

export const FeedPage = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [grupos, setGrupos] = useState<GrupoResumo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoResumo | null>(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const usuarioId = getUsuarioIdFromToken() ?? "";

  const posts = [
    { id: 1, autor: "Guilherme", conteudo: "Primeiro post do ConectElo!" },
    { id: 2, autor: "Admin", conteudo: "Sistema de feed validado." },
  ];

  useEffect(() => {
    buscarGruposDoUsuario(usuarioId)
      .then((data) => {
        setGrupos(data);
        if (data.length > 0) setGrupoSelecionado(data[0]);
      })
      .catch((err) => console.error("Erro ao buscar grupos:", err));
  }, [usuarioId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          style={{ marginRight: "15px", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}
        >
          ☰
        </button>
        <span>ConectElo</span>
      </nav>

      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={handleLogout} />

      <div className="p-4">
        <div className="mx-auto max-w-xl rounded-2xl bg-gray-800 px-4 py-3 flex flex-col gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownAberto(!dropdownAberto)}
              className="flex items-center gap-1 text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              {grupoSelecionado?.nome ?? "Escolha um grupo"}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

            {dropdownAberto && (
              <ul className="absolute left-0 top-full mt-2 min-w-48 rounded-xl bg-gray-700 border border-gray-600 shadow-xl overflow-hidden z-10">
                {grupos.map(grupo => (
                  <li
                    key={grupo.id}
                    onClick={() => { setGrupoSelecionado(grupo); setDropdownAberto(false); }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 transition-colors ${grupoSelecionado?.id === grupo.id ? "text-green-400 font-semibold" : "text-white"}`}
                  >
                    {grupo.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {grupoSelecionado && (
            <PostagemForm usuarioId={usuarioId} muralId={grupoSelecionado.muralId} />
          )}

          {grupos.length === 0 && (
            <p className="text-sm text-gray-400">Você não participa de nenhum grupo ainda.</p>
          )}
        </div>
      </div>

      <main style={{ padding: "20px" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #eee", padding: "10px", marginBottom: "10px" }}>
            <strong>{post.autor}</strong>
            <p>{post.conteudo}</p>
          </div>
        ))}
      </main>
    </div>
  );
};
