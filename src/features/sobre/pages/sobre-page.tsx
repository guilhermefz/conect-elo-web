import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { CodeBracketIcon, HeartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function SobrePage() {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-white font-black text-xl uppercase tracking-widest">Sobre</h1>

        {/* Logo e versão */}
        <div className="bg-[#1e1b2e] rounded-2xl p-6 flex flex-col items-center gap-2">
          <div className="size-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl">
            🔗
          </div>
          <p className="text-white font-black text-xl tracking-widest uppercase mt-1">ConectElo</p>
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Versão 1.0.0</p>
          <p className="text-gray-400 text-sm text-center leading-relaxed mt-1">
            Plataforma de comunicação e organização para grupos e equipes. Conecte-se, colabore e cresça junto.
          </p>
        </div>

        {/* Missão */}
        <div className="bg-[#1e1b2e] rounded-2xl p-4 flex gap-4 items-start">
          <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <HeartIcon className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Nossa missão</p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              Facilitar a comunicação entre estudantes e profissionais, criando um ambiente colaborativo, seguro e acessível para todos.
            </p>
          </div>
        </div>

        {/* Tecnologia */}
        <div className="bg-[#1e1b2e] rounded-2xl p-4 flex gap-4 items-start">
          <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <CodeBracketIcon className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Tecnologia</p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              Desenvolvido com React, TypeScript, .NET e PostgreSQL. Comunicação em tempo real via SignalR para uma experiência fluida e moderna.
            </p>
          </div>
        </div>

        {/* Privacidade */}
        <div className="bg-[#1e1b2e] rounded-2xl p-4 flex gap-4 items-start">
          <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Privacidade e segurança</p>
            <p className="text-gray-400 text-xs leading-relaxed mt-1">
              Seus dados são protegidos com autenticação JWT e comunicação criptografada. Nenhuma informação é compartilhada com terceiros.
            </p>
          </div>
        </div>

        {/* Equipe */}
        <div className="flex flex-col gap-2">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Equipe</p>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            {[
              { nome: "Guilherme Fiuza", papel: "Desenvolvedor Backend" },
              { nome: "Affonso Ely", papel: "Desenvolvedor Frontend" },
            ].map((membro, i, arr) => (
              <div
                key={membro.nome}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < arr.length - 1 ? "border-b border-[#2e2b42]" : ""
                }`}
              >
                <div className="size-9 rounded-full bg-gray-700 flex items-center justify-center text-base shrink-0">
                  👤
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{membro.nome}</p>
                  <p className="text-gray-400 text-xs">{membro.papel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 pb-4">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Legal</p>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            {["Termos de uso", "Política de privacidade"].map((item, i, arr) => (
              <button
                key={item}
                className={`flex items-center justify-between w-full px-4 py-3 hover:bg-[#252236] transition-colors ${
                  i < arr.length - 1 ? "border-b border-[#2e2b42]" : ""
                }`}
              >
                <p className="text-white text-sm">{item}</p>
                <span className="text-gray-500 text-lg">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
