import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { useToast } from "../../../components/toast";
import { obterInteressesDisponiveis, obterPerfil, atualizarInteresses } from "../services/perfil-service";
import type { Interesse } from "../services/perfil-service";

const MAX = 5;
const MIN = 3;

export function EditarInteressesPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuAberto, setMenuAberto] = useState(false);
  const [catalogo, setCatalogo] = useState<Interesse[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([obterInteressesDisponiveis(), obterPerfil()])
      .then(([cat, perfil]) => {
        setCatalogo(cat);
        setSelecionados((perfil.interesses ?? []).map((i) => i.id));
      })
      .catch(() => toast.erro("Erro ao carregar interesses."))
      .finally(() => setCarregando(false));
  }, []);

  function alternar(id: string) {
    setSelecionados((atual) => {
      if (atual.includes(id)) return atual.filter((x) => x !== id);
      if (atual.length >= MAX) {
        toast.aviso(`Você pode selecionar no máximo ${MAX} interesses.`);
        return atual;
      }
      return [...atual, id];
    });
  }

  async function handleConcluir() {
    if (selecionados.length < MIN) {
      toast.aviso(`Escolha no mínimo ${MIN} interesses.`);
      return;
    }
    setSalvando(true);
    try {
      await atualizarInteresses(selecionados);
      navigate("/perfil", { state: { mensagem: "Interesses atualizados com sucesso!" } });
    } catch {
      toast.erro("Erro ao salvar interesses. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Editar interesses" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        {carregando ? (
          <p className="text-gray-400 text-center mt-10">Carregando...</p>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="text-white text-2xl font-bold">Interesses</h2>
              <span className="text-sm font-semibold text-gray-400">
                {selecionados.length}/{MAX}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Selecione os interesses que gostaria de compartilhar com as pessoas com as quais você se conecta. Escolha no mínimo {MIN}.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {catalogo.map((i) => {
                const ativo = selecionados.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => alternar(i.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      ativo
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                        : "border-subtle text-gray-300 hover:bg-surface-hover"
                    }`}
                  >
                    {i.nome}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {!carregando && (
        <div className="p-4 max-w-lg mx-auto w-full">
          <button
            type="button"
            onClick={handleConcluir}
            disabled={salvando || selecionados.length < MIN}
            className="w-full bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-full py-4 hover:bg-emerald-400 transition-colors disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Concluído"}
          </button>
        </div>
      )}
    </div>
  );
}
