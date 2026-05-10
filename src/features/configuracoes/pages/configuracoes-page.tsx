import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import {
  BellIcon,
  LockClosedIcon,
  PaintBrushIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface Toggles {
  notificacoesGerais: boolean;
  notificacoesChat: boolean;
  notificacoesAvisos: boolean;
  perfilPublico: boolean;
  mostrarOnline: boolean;
  temaEscuro: boolean;
}

export function ConfiguracoesPage() {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    notificacoesGerais: true,
    notificacoesChat: true,
    notificacoesAvisos: false,
    perfilPublico: true,
    mostrarOnline: true,
    temaEscuro: true,
  });

  function toggle(key: keyof Toggles) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-6">
        <h1 className="text-white font-black text-xl uppercase tracking-widest">Configurações</h1>

        {/* Conta */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <UserIcon className="size-4 text-emerald-500" />
            <span className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Conta</span>
          </div>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            {[
              { label: "Alterar senha", sub: "Atualize sua senha de acesso" },
              { label: "Alterar e-mail", sub: "Mude o e-mail vinculado à conta" },
              { label: "Excluir conta", sub: "Ação permanente e irreversível" },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                className={`flex items-center justify-between w-full px-4 py-3 hover:bg-[#252236] transition-colors ${
                  i < arr.length - 1 ? "border-b border-[#2e2b42]" : ""
                }`}
              >
                <div className="text-left">
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-400 text-xs">{item.sub}</p>
                </div>
                <span className="text-gray-500 text-lg">›</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notificações */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BellIcon className="size-4 text-emerald-500" />
            <span className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Notificações</span>
          </div>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            {(
              [
                { key: "notificacoesGerais", label: "Notificações gerais", sub: "Receber alertas do sistema" },
                { key: "notificacoesChat", label: "Mensagens no chat", sub: "Notificar novas mensagens" },
                { key: "notificacoesAvisos", label: "Avisos dos grupos", sub: "Alertas de eventos e avisos" },
              ] as { key: keyof Toggles; label: string; sub: string }[]
            ).map((item, i, arr) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < arr.length - 1 ? "border-b border-[#2e2b42]" : ""
                }`}
              >
                <div>
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-400 text-xs">{item.sub}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    toggles[item.key] ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform ${
                      toggles[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacidade */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LockClosedIcon className="size-4 text-emerald-500" />
            <span className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Privacidade</span>
          </div>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            {(
              [
                { key: "perfilPublico", label: "Perfil público", sub: "Qualquer usuário pode ver seu perfil" },
                { key: "mostrarOnline", label: "Mostrar quando online", sub: "Exibir status de conexão" },
              ] as { key: keyof Toggles; label: string; sub: string }[]
            ).map((item, i, arr) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < arr.length - 1 ? "border-b border-[#2e2b42]" : ""
                }`}
              >
                <div>
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-400 text-xs">{item.sub}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    toggles[item.key] ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform ${
                      toggles[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Aparência */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <PaintBrushIcon className="size-4 text-emerald-500" />
            <span className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Aparência</span>
          </div>
          <div className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-white text-sm font-bold">Tema escuro</p>
                <p className="text-gray-400 text-xs">Interface com fundo escuro</p>
              </div>
              <button
                onClick={() => toggle("temaEscuro")}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  toggles.temaEscuro ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 size-4 bg-white rounded-full shadow transition-transform ${
                    toggles.temaEscuro ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
