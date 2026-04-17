import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { postService } from "../services/post-service";

export const FeedPage = () => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [novoPost, setNovoPost] = useState("");

  const posts = [
      { id: 1, autor: "Guilherme", conteudo: "Primeiro post do ConectElo!" },
      { id: 2, autor: "Admin", conteudo: "Sistema de feed validado." }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login")
  };

  const handleCriarPost = async () => {
    try{
      await postService.criar(novoPost);

      setNovoPost("");
      alert("Postado com sucesso!");
    } catch (error) {
      console.error("Erro ao postar", error);
      alert("Erro ao publicar. Varifique se seu token ainda é válido.");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
        
        <button onClick={() => setMenuAberto(!menuAberto)} style={{ marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
          {menuAberto ? '✕' : '☰'}
        </button>

        <span>ConectElo</span>
      </nav>

      {menuAberto && (
        <div style={{ background: '#f9f9f9', padding: '10px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>
          <p>Perfil</p>
          <p
            onClick={handleLogout} 
            style={{ color: 'red' }}>Sair</p>
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <textarea
          placeholder="O que está acontecendo?"
          value={novoPost}
          onChange={(e) => setNovoPost(e.target.value)}
          style={{ width: '100%', minHeight: '60px', display: 'block', marginBottom: '10px' }}
        />
        <button onClick={handleCriarPost}>Postar</button>
      </div>

      <main style={{ padding: '20px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
            <strong>{post.autor}</strong>
            <p>{post.conteudo}</p>
          </div>
        ))}
      </main>
    </div>
  );
};