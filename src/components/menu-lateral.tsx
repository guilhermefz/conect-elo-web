import { HomeIcon, ChatBubbleLeftIcon, BellIcon, ArrowRightStartOnRectangleIcon, XMarkIcon, GlobeAltIcon, Cog6ToothIcon, QuestionMarkCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { obterPerfil, buildFotoUrl } from "../features/perfil/services/perfil-service";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSair: () => void;
}

interface MenuItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  ativo?: boolean;
  onClick?: () => void;
}

export function MenuLateral({ aberto, onFechar, onSair }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    obterPerfil()
      .then((d) => {
        setNomeUsuario(d.nome);
        if (d.fotoPerfilUrl) setFotoUrl(buildFotoUrl(d.fotoPerfilUrl));
      })
      .catch(() => {});

    function handleFotoAtualizada(e: Event) {
      setFotoUrl((e as CustomEvent<string>).detail);
    }
    window.addEventListener("foto-perfil-atualizada", handleFotoAtualizada);
    return () => window.removeEventListener("foto-perfil-atualizada", handleFotoAtualizada);
  }, []);

  const itens: MenuItem[] = [
    { label: "Murais", icon: HomeIcon, ativo: pathname === "/feed", onClick: () => { onFechar(); navigate("/feed"); } },
    { label: "Global", icon: GlobeAltIcon, ativo: pathname === "/global", onClick: () => { onFechar(); navigate("/global"); } },
    { label: "Chats", icon: ChatBubbleLeftIcon, ativo: pathname === "/grupos", onClick: () => { onFechar(); navigate("/grupos"); } },
    { label: "Avisos", icon: BellIcon, ativo: pathname === "/avisos", onClick: () => { onFechar(); navigate("/avisos"); } },
    { label: "Configurações", icon: Cog6ToothIcon, ativo: pathname === "/configuracoes", onClick: () => { onFechar(); navigate("/configuracoes"); } },
    { label: "Ajuda", icon: QuestionMarkCircleIcon, ativo: pathname === "/ajuda", onClick: () => { onFechar(); navigate("/ajuda"); } },
    { label: "Sobre", icon: InformationCircleIcon, ativo: pathname === "/sobre", onClick: () => { onFechar(); navigate("/sobre"); } },
    { label: "Sair", icon: ArrowRightStartOnRectangleIcon, onClick: onSair },
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-[#12111a] flex flex-col p-6 transition-transform duration-300 ease-in-out ${aberto ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex justify-end mb-6">
        <button onClick={onFechar} className="size-10 rounded-xl bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <button
        onClick={() => { onFechar(); navigate("/perfil"); }}
        className={`flex items-center gap-4 px-5 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-colors mb-2 ${pathname === "/perfil" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}
      >
        <div className="size-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-green-500 text-xs">
          {fotoUrl
            ? <img src={fotoUrl} alt="Perfil" className="size-full object-cover" />
            : "🤝"
          }
        </div>
        <span className="truncate">{nomeUsuario || "Perfil"}</span>
      </button>

      <nav className="flex flex-col gap-2">
        {itens.map(({ label, icon: Icon, ativo, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-4 px-5 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-colors ${ativo ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
