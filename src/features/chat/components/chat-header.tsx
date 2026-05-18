import { XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface Props {
  nome: string;
  imgGrupo?: string | null;
  onInfoAbrir: () => void;
}

export function ChatHeader({ nome, imgGrupo, onInfoAbrir }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#1e1b2e]">
      <button
        onClick={() => navigate("/grupos")}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Voltar"
      >
        <XMarkIcon className="size-5" />
      </button>

      <div className="size-9 rounded-full bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center text-base">
        {imgGrupo
          ? <img src={imgGrupo} alt={nome} className="size-full object-cover" />
          : <span>🤝</span>
        }
      </div>

      <p className="flex-1 text-white font-bold text-sm">{nome}</p>

      <button
        onClick={onInfoAbrir}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Informações"
      >
        <InformationCircleIcon className="size-5" />
      </button>
    </div>
  );
}
