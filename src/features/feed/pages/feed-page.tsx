import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { PostagemForm } from "../components/postagem-form";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { buscarGruposDoUsuario } from "../../grupo/services/grupo-service";
import type { GrupoResumo } from "../../grupo/services/grupo-service";

export const FeedPage = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [grupos, setGrupos] = useState<GrupoResumo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoResumo | null>(null);
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
          {menuAberto ? "✕" : "☰"}
        </button>
        <span>ConectElo</span>
      </nav>

      {menuAberto && (
        <div style={{ background: "#f9f9f9", padding: "10px", textAlign: "left", borderBottom: "1px solid #ccc" }}>
          <p>Perfil</p>
          <p onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>Sair</p>
        </div>
      )}

      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>

        <select
          value={grupoSelecionado?.id ?? ""}
          onChange={(e) => {
            const grupo = grupos.find(g => g.id === e.target.value) || null;
            setGrupoSelecionado(grupo);
          }}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="" disabled>Escolha um grupo...</option>
          {grupos.map(grupo => (
            <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
          ))}
        </select>

        {grupoSelecionado && (
          <PostagemForm usuarioId={usuarioId} muralId={grupoSelecionado.muralId} />
        )}

        {grupos.length === 0 && (
          <p style={{ color: "#888", fontSize: "14px" }}>Você não participa de nenhum grupo ainda.</p>
        )}

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
