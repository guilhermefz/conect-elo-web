import { useRef } from "react";
import { CameraIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

interface Props {
  nome: string;
  bio: string;
  fotoUrl: string | null;
  erro: string;
  onFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditar: () => void;
}

export function PerfilCard({ nome, bio, fotoUrl, erro, onFotoChange, onEditar }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col items-center p-6">
      <div className="relative mt-10">
        <div className="size-28 rounded-full bg-gray-700 overflow-hidden border-2 border-emerald-500">
          {fotoUrl
            ? <img src={fotoUrl} alt="Foto de perfil" className="size-full object-cover" />
            : <span className="size-full flex items-center justify-center text-gray-400 text-4xl font-bold">{nome.charAt(0).toUpperCase()}</span>
          }
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-colors"
        >
          <CameraIcon className="size-4" />
        </button>
      </div>

      <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={onFotoChange} />

      <h2 className="text-white text-xl font-bold mt-4">{nome}</h2>
      {bio && <p className="text-gray-400 text-sm text-center mt-1 max-w-xs">{bio}</p>}
      {erro && <p className="text-red-400 text-xs mt-2">{erro}</p>}

      <button
        onClick={onEditar}
        className="mt-10 flex items-center gap-2 bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-full px-8 py-4 hover:bg-emerald-400 transition-colors"
      >
        <PencilSquareIcon className="size-4" />
        Editar perfil
      </button>
    </div>
  );
}
