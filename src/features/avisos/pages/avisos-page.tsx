import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { AvisoCard } from "../components/aviso-card";
import type { Aviso } from "../components/aviso-card";

const MOCK_AVISOS: Aviso[] = [
  { id: 1, mensagem: "O sorteio do Amigo Secreto acontece hoje!", tempo: "Há 1h", lido: false },
  { id: 2, mensagem: "Ana Silva comentou na sua publicação.", tempo: "Há 3h", lido: true },
];

export function AvisosPage() {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-white font-black text-xl uppercase tracking-widest">Avisos</h1>

        <div className="flex flex-col gap-3">
          {MOCK_AVISOS.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} />
          ))}
        </div>
      </div>
    </div>
  );
}
