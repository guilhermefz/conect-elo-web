import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { obterGrupoPorId, atualizarGrupo } from "../services/grupo-service";
import type { AtualizarGrupoPayload } from "../services/grupo-service";
import { EditarGrupoForm } from "../components/editar-grupo-form";

const FORM_VAZIO: AtualizarGrupoPayload = { nome: "", descricao: "", privado: false };

export function EditarGrupoPage() {
  const { id } = useParams<{ id: string }>();
  const logout = useLogout();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [form, setForm] = useState<AtualizarGrupoPayload>(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterGrupoPorId(id!)
      .then((d) => setForm({ nome: d.nome, descricao: d.descricao ?? "", privado: d.privado, imgGrupo: d.imgGrupo }))
      .catch(() => setErro("Erro ao carregar grupo."))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit() {
    setSalvando(true);
    setErro("");
    try {
      await atualizarGrupo(id!, form);
      navigate(`/grupos/${id}/chat`, { state: { sucesso: true } });
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Editar grupo" onMenuAbrir={() => setMenuAberto(true)} />
      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        {carregando
          ? <p className="text-gray-400 text-center mt-10">Carregando...</p>
          : <EditarGrupoForm form={form} setForm={setForm} salvando={salvando} erro={erro} onSubmit={handleSubmit} />
        }
      </div>
    </div>
  );
}
