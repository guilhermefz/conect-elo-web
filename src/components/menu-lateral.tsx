import { HomeIcon, ChatBubbleLeftIcon, BellIcon, UserIcon, ArrowLeftOnRectangleIcon, XMarkIcon, GlobeAltIcon, Cog6ToothIcon, QuestionMarkCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  const itens: MenuItem[] = [
    { label: "Murais", icon: HomeIcon, ativo: pathname === "/feed", onClick: () => { onFechar(); navigate("/feed"); } },
    { label: "Global", icon: GlobeAltIcon, ativo: pathname === "/global", onClick: () => { onFechar(); navigate("/global"); } },
    { label: "Chats", icon: ChatBubbleLeftIcon, ativo: pathname === "/grupos", onClick: () => { onFechar(); navigate("/grupos"); } },
    { label: "Avisos", icon: BellIcon, ativo: pathname === "/avisos", onClick: () => { onFechar(); navigate("/avisos"); } },
    { label: "Perfil", icon: UserIcon, ativo: pathname === "/perfil", onClick: () => { onFechar(); navigate("/perfil"); } },
    { label: "Configurações", icon: Cog6ToothIcon, ativo: pathname === "/configuracoes", onClick: () => { onFechar(); navigate("/configuracoes"); } },
    { label: "Ajuda", icon: QuestionMarkCircleIcon, ativo: pathname === "/ajuda", onClick: () => { onFechar(); navigate("/ajuda"); } },
    { label: "Sobre", icon: InformationCircleIcon, ativo: pathname === "/sobre", onClick: () => { onFechar(); navigate("/sobre"); } },
    { label: "Sair", icon: ArrowLeftOnRectangleIcon, onClick: onSair },
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-[#12111a] flex flex-col p-6 transition-transform duration-300 ease-in-out ${aberto ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-white text-xl font-bold uppercase tracking-widest">Menu</p>
          <p className="text-green-500 text-xs font-bold uppercase tracking-widest mt-0.5">Ambiente Seguro</p>
        </div>
        <button onClick={onFechar} className="size-10 rounded-xl bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
          <XMarkIcon className="size-5" />
        </button>
      </div>

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
