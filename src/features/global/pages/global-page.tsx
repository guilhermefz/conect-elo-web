import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

interface PostGlobal {
  id: number;
  grupo: string;
  autor: string;
  conteudo: string;
  tempo: string;
}

const MOCK_POSTS: PostGlobal[] = [
  {
    id: 1,
    grupo: "Turma de TI 2025",
    autor: "Lucas Ferreira",
    conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tempo: "Há 10 min",
  },
  {
    id: 2,
    grupo: "Projetos Integrados",
    autor: "Mariana Costa",
    conteudo: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tempo: "Há 35 min",
  },
  {
    id: 3,
    grupo: "Estudantes SENAI",
    autor: "Rafael Oliveira",
    conteudo: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    tempo: "Há 1h",
  },
  {
    id: 4,
    grupo: "Desenvolvimento Web",
    autor: "Fernanda Lima",
    conteudo: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tempo: "Há 2h",
  },
  {
    id: 5,
    grupo: "Design & UX",
    autor: "Carlos Mendes",
    conteudo: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie ultricies ultrices.",
    tempo: "Há 3h",
  },
];

export function GlobalPage() {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-white font-black text-xl uppercase tracking-widest">Global</h1>

        <div className="flex flex-col gap-3">
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="bg-[#1e1b2e] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <GlobeAltIcon className="size-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{post.autor}</p>
                  <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider truncate">
                    {post.grupo}
                  </p>
                </div>
                <span className="text-gray-500 text-xs shrink-0">{post.tempo}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{post.conteudo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
