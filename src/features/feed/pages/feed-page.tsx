import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostagemForm } from "../components/postagem-form";
import { getUsuarioIdFromToken } from "../../../lib/jwt";

const MURAL_ID = "c3e99bcb-8222-41f8-89d5-4201087044ed";

export const FeedPage = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const usuarioId = getUsuarioIdFromToken() ?? "";

  const posts = [
    { id: 1, autor: "Guilherme", conteudo: "Primeiro post do ConectElo!" },
    { id: 2, autor: "Admin", conteudo: "Sistema de feed validado." },
  ];

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
          <p onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>
            Sair
          </p>
        </div>
      )}

      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <PostagemForm usuarioId={usuarioId} muralId={MURAL_ID} />
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
