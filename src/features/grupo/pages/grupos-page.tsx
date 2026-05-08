import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarGruposDoUsuario, buildFotoGrupoUrl } from "../services/grupo-service";
import type { GrupoResumo } from "../services/grupo-service";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { MenuLateral } from "../../../components/menu-lateral";
import { Navbar } from "../../../components/navbar";
import { useLogout } from "../../../hooks/useLogout";
import { GrupoCard } from "../components/grupo-card";
import { Fab } from "../components/fab";

type Aba = "recentes" | "anonimo";

export function GruposPage() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [aba, setAba] = useState<Aba>("recentes");
  const [grupos, setGrupos] = useState<GrupoResumo[]>([]);
  const usuarioId = getUsuarioIdFromToken() ?? "";

  useEffect(() => {
    buscarGruposDoUsuario(usuarioId)
      .then(setGrupos)
      .catch((err) => console.error("Erro ao buscar grupos:", err));
  }, [usuarioId]);

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />

      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="flex p-4 gap-2">
        <button
          onClick={() => setAba("recentes")}
          className={`flex-1 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ${aba === "recentes" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}
        >
          Recentes
        </button>
        <button
          onClick={() => setAba("anonimo")}
          className={`flex-1 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ${aba === "anonimo" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}
        >
          Anônimo
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-24">
        {grupos.map((grupo) => (
          <GrupoCard
            key={grupo.id}
            nome={grupo.nome}
            fotoUrl={grupo.imgGrupo ? buildFotoGrupoUrl(grupo.imgGrupo) : null}
            onClick={() => navigate(`/grupos/${grupo.id}/chat`, { state: { nome: grupo.nome } })}
          />
        ))}

        {grupos.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-10">Você não participa de nenhum grupo ainda.</p>
        )}
      </div>

      <Fab
        opcoes={[
          { label: "Novo grupo", rota: "/grupos/novo" },
        ]}
      />
    </div>
  );
}
