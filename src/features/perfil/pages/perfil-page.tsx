import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { obterPerfil, atualizarFoto, buildFotoUrl } from "../services/perfil-service";
import { PerfilCard } from "../components/perfil-card";
import { ToastSucesso } from "../components/toast-sucesso";

export function PerfilPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState((location.state as { sucesso?: boolean })?.sucesso ?? false);

  useEffect(() => {
    obterPerfil()
      .then((d) => {
        setNome(d.nome ?? "");
        setBio(d.bio ?? "");
        setFotoUrl(d.fotoPerfilUrl ? buildFotoUrl(d.fotoPerfilUrl) : null);
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");
    try {
      const url = await atualizarFoto(file);
      const novaUrl = buildFotoUrl(url);
      setFotoUrl(null);
      setTimeout(() => setFotoUrl(novaUrl), 0);
      window.dispatchEvent(new CustomEvent("foto-perfil-atualizada", { detail: novaUrl }));
    } catch {
      setErro("Erro ao enviar foto (máx. 5MB, JPG/PNG/WebP).");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Perfil" onMenuAbrir={() => setMenuAberto(true)} />
      <ToastSucesso visivel={toast} />

      {carregando
        ? <p className="text-gray-400 text-center mt-10">Carregando...</p>
        : <PerfilCard
            nome={nome}
            bio={bio}
            fotoUrl={fotoUrl}
            erro={erro}
            onFotoChange={handleFoto}
            onEditar={() => navigate("/perfil/editar")}
          />
      }
    </div>
  );
}
