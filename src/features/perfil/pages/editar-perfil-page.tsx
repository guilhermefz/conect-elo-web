import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { obterPerfil, atualizarPerfil } from "../services/perfil-service";
import type { AtualizarPerfilPayload } from "../services/perfil-service";
import { EditarPerfilForm } from "../components/editar-perfil-form";

const FORM_VAZIO: AtualizarPerfilPayload = { nome: "", email: "", bio: "", dataNascimento: "", genero: 0 };

export function EditarPerfilPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterPerfil()
      .then((d) => setForm({ nome: d.nome ?? "", email: d.email ?? "", bio: d.bio ?? "", dataNascimento: d.dataNascimento?.split("T")[0] ?? "", genero: d.genero ?? 0 }))
      .catch(() => setErro("Erro ao carregar perfil."))
      .finally(() => setCarregando(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await atualizarPerfil(form);
      navigate("/perfil", { state: { sucesso: true } });
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Editar Perfil" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        {carregando
          ? <p className="text-gray-400 text-center mt-10">Carregando...</p>
          : <EditarPerfilForm form={form} setForm={setForm} salvando={salvando} erro={erro} onSubmit={handleSubmit} />
        }
      </div>
    </div>
  );
}
