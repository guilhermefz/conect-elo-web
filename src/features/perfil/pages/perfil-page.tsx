import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { MensagemErro } from "../../../components/mensagem-erro";
import { useLogout } from "../../../hooks/useLogout";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { obterPerfil, atualizarFoto, buildFotoUrl } from "../services/perfil-service";
import { PerfilCard } from "../components/perfil-card";
import { Toast } from "../../../components/toast";

export function PerfilPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroFoto, setErroFoto] = useState("");
  const { erro, capturarErro, limparErro } = useErrorHandler();
  const [toast, setToast] = useState<{ mensagem: string; variante: "sucesso" | "erro" | "aviso" } | null>(null);

  useEffect(() => {
    obterPerfil()
      .then((d) => {
        setNome(d.nome ?? "");
        setBio(d.bio ?? "");
        setFotoUrl(d.fotoPerfilUrl ? buildFotoUrl(d.fotoPerfilUrl) : null);
      })
      .catch(capturarErro)
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (location.state?.mensagem) {
      setToast(location.state.mensagem);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErroFoto("");
    try {
      const url = await atualizarFoto(file);
      const novaUrl = `${buildFotoUrl(url)}?t=${Date.now()}`;
      setFotoUrl(null);
      setTimeout(() => setFotoUrl(novaUrl), 0);
      window.dispatchEvent(new CustomEvent("foto-perfil-atualizada", { detail: novaUrl }));
      setToast({ mensagem: "Foto atualizada com sucesso!", variante: "sucesso" });
    } catch {
      setErroFoto("Erro ao enviar foto (máx. 5MB, JPG/PNG/WebP).");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Perfil" onMenuAbrir={() => setMenuAberto(true)} />
      <Toast mensagem={toast?.mensagem ?? null} variante={toast?.variante} />

      {erro && (
        <div className="p-4">
          <MensagemErro texto={erro} onFechar={limparErro} />
        </div>
      )}

      {carregando
        ? <p className="text-gray-400 text-center mt-10">Carregando...</p>
        : <PerfilCard
            nome={nome}
            bio={bio}
            fotoUrl={fotoUrl}
            erro={erroFoto}
            onFotoChange={handleFoto}
            onEditar={() => navigate("/perfil/editar")}
          />
      }
    </div>
  );
}
