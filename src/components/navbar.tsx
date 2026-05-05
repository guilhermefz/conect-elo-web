import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obterPerfil, buildFotoUrl } from "../features/perfil/services/perfil-service";

interface Props {
  titulo: string;
  onMenuAbrir: () => void;
}

export function Navbar({ titulo, onMenuAbrir }: Props) {
  const navigate = useNavigate();
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    obterPerfil()
      .then((d) => {
        if (d.fotoPerfilUrl) setFotoUrl(buildFotoUrl(d.fotoPerfilUrl));
      })
      .catch(() => {});

    function handleFotoAtualizada(e: Event) {
      setFotoUrl((e as CustomEvent<string>).detail);
    }
    window.addEventListener("foto-perfil-atualizada", handleFotoAtualizada);
    return () => window.removeEventListener("foto-perfil-atualizada", handleFotoAtualizada);
  }, []);

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-[#12111a]">
      <button onClick={onMenuAbrir} className="text-white text-xl">
        ☰
      </button>
      <span className="text-white font-bold uppercase tracking-widest text-sm">{titulo}</span>
      <button onClick={() => navigate("/perfil")} className="size-9 rounded-full bg-green-500 overflow-hidden flex items-center justify-center text-base hover:opacity-80 transition-opacity">
        {fotoUrl
          ? <img src={fotoUrl} alt="Perfil" className="size-full object-cover" />
          : "🤝"
        }
      </button>
    </nav>
  );
}
