import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { BuscaGlobal } from "../components/BuscaGlobal";
import { SecaoEventos } from "../components/SecaoEventos";
import { SECOES_MOCK } from "../data/eventos-mock";

export function GlobalPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const secoesFiltradas = busca.trim()
    ? SECOES_MOCK.map((s) => ({
        ...s,
        eventos: s.eventos.filter((e) =>
          e.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          e.categoria.toLowerCase().includes(busca.toLowerCase())
        ),
      })).filter((s) => s.eventos.length > 0)
    : SECOES_MOCK;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="flex flex-col gap-6 py-4">
        <div className="px-4">
          <h1 className="text-white font-black text-2xl">Descobrir</h1>
          <p className="text-gray-500 text-sm mt-1">Eventos públicos abertos pra todo mundo</p>
        </div>

        <BuscaGlobal valor={busca} onChange={setBusca} />

        {secoesFiltradas.length > 0 ? (
          secoesFiltradas.map((secao) => (
            <SecaoEventos
              key={secao.id}
              secao={secao}
              onAbrirEvento={(id) => navigate(`/eventos/${id}`)}
              onVerTudo={(secaoId) => navigate(`/global/${secaoId}`)}
            />
          ))
        ) : (
          <p className="px-4 text-gray-500 text-sm">
            Nenhum evento encontrado para "{busca}".
          </p>
        )}
      </div>
    </div>
  );
}
