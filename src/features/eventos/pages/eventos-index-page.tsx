import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { EventoCard } from "../components/evento-card";
import { type ExibirEventoResumo, listarEventosDoUsuario } from "../services/evento-service";

export function EventosIndexPage() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [eventos, setEventos] = useState<ExibirEventoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarEventosDoUsuario()
      .then(setEventos)
      .finally(() => setCarregando(false));
  }, []);

  function sair() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  return (
    <div className="flex flex-col h-dvh bg-background">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={sair} />
      <Navbar titulo="Eventos" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="flex-1 overflow-y-auto py-2">
        {carregando ? (
          <p className="text-gray-500 text-sm text-center mt-10">Carregando...</p>
        ) : eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-16">
            <p className="text-4xl">🎉</p>
            <p className="text-white font-bold">Nenhum evento ainda</p>
          </div>
        ) : (
          eventos.map((evento) => <EventoCard key={evento.id} evento={evento} />)
        )}
      </div>
    </div>
  );
}