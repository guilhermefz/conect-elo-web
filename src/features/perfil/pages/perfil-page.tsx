import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { MensagemErro } from "../../../components/mensagem-erro";
import { useLogout } from "../../../hooks/useLogout";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { obterPerfil, atualizarFoto, buildFotoUrl } from "../services/perfil-service";
import type { Interesse } from "../services/perfil-service";
import { PerfilCard } from "../components/perfil-card";
import { InteressesSecao } from "../components/interesses-secao";
import { useToast } from "../../../components/toast";

export function PerfilPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [menuAberto, setMenuAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [interesses, setInteresses] = useState<Interesse[]>([]);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroFoto, setErroFoto] = useState("");
  const { erro, capturarErro, limparErro } = useErrorHandler();
  const toastExibido = useRef(false);

  useEffect(() => {
    obterPerfil()
      .then((d) => {
        setNome(d.nome ?? "");
        setBio(d.bio ?? "");
        setInteresses(d.interesses ?? []);
        setFotoUrl(d.fotoPerfilUrl ? buildFotoUrl(d.fotoPerfilUrl) : null);
      })
      .catch(capturarErro)
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    // O guard com ref evita o toast duplicado da dupla execução do efeito no
    // StrictMode; limpar o state impede que ele reapareça ao voltar pelo histórico.
    if (location.state?.mensagem && !toastExibido.current) {
      toastExibido.current = true;
      toast.sucesso(location.state.mensagem);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

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
      toast.sucesso("Foto atualizada com sucesso!");
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

      {erro && (
        <div className="p-4">
          <MensagemErro texto={erro} onFechar={limparErro} />
        </div>
      )}

      {carregando
        ? <p className="text-gray-400 text-center mt-10">Carregando...</p>
        : <div className="flex-1 overflow-y-auto">
            <PerfilCard
              nome={nome}
              bio={bio}
              fotoUrl={fotoUrl}
              erro={erroFoto}
              onFotoChange={handleFoto}
              onEditar={() => navigate("/perfil/editar")}
            />
            <div className="px-6 pb-8 max-w-md mx-auto w-full">
              <InteressesSecao interesses={interesses} onEditar={() => navigate("/perfil/interesses")} />
            </div>
          </div>
      }
    </div>
  );
}
