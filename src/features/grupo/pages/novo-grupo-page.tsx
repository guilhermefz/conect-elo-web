import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrupoForm } from "../components/grupo-form";
import type { GrupoFormData } from "../components/grupo-form";
import { criarGrupo } from "../services/grupo-service";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { getUsuarioIdFromToken } from "../../../lib/jwt";

export function NovoGrupoPage() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(dados: GrupoFormData) {
    const proprietarioId = getUsuarioIdFromToken();
    if (!proprietarioId) {
      setErro("Sessão expirada. Faça login novamente.");
      return;
    }

    setLoading(true);
    setErro("");
    try {
      await criarGrupo({ ...dados, proprietarioId });
      navigate("/grupos");
    } catch {
      setErro("Erro ao criar grupo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />

      <Navbar titulo="Novo grupo" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4">
        <GrupoForm onSubmit={handleSubmit} loading={loading} erro={erro} />
      </div>
    </div>
  );
}
