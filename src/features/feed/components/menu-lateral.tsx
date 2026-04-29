import { HomeIcon, ChatBubbleLeftIcon, BellIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";

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
  const itens: MenuItem[] = [
    { label: "Murais", icon: HomeIcon, ativo: true },
    { label: "Chats", icon: ChatBubbleLeftIcon },
    { label: "Avisos", icon: BellIcon },
    { label: "Meu Perfil", icon: UserIcon, onClick: onSair },
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
