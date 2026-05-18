import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { MenuLateral } from "../../../components/menu-lateral";
import { useLogout } from "../../../hooks/useLogout";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Faq {
  id: number;
  pergunta: string;
  resposta: string;
}

const FAQS: Faq[] = [
  {
    id: 1,
    pergunta: "Como entro em um grupo?",
    resposta: "Para entrar em um grupo, acesse a aba Chats e solicite o ingresso ao administrador do grupo. Você receberá um aviso quando sua solicitação for aceita.",
  },
  {
    id: 2,
    pergunta: "Como crio um novo grupo?",
    resposta: "Na tela de Chats, toque no botão verde (+) no canto inferior direito e selecione 'Novo grupo'. Preencha o nome, a descrição e defina se o grupo será público ou privado.",
  },
  {
    id: 3,
    pergunta: "Como altero minha foto de perfil?",
    resposta: "Acesse a tela de Perfil pelo menu lateral e toque no ícone de câmera sobre sua foto atual. Selecione uma imagem da galeria e confirme o envio.",
  },
  {
    id: 4,
    pergunta: "Esqueci minha senha. O que faço?",
    resposta: "Na tela de login, toque em 'Esqueci minha senha', informe seu e-mail e siga as instruções enviadas para sua caixa de entrada.",
  },
  {
    id: 5,
    pergunta: "Como funciona o feed de Murais?",
    resposta: "O feed exibe as postagens dos grupos dos quais você faz parte. Use o seletor de grupo para filtrar as publicações por grupo específico.",
  },
  {
    id: 6,
    pergunta: "Posso excluir uma mensagem enviada?",
    resposta: "No momento, a exclusão de mensagens individuais ainda não está disponível. Esta funcionalidade será adicionada em breve.",
  },
];

export function AjudaPage() {
  const logout = useLogout();
  const [menuAberto, setMenuAberto] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  const faqsFiltrados = FAQS.filter((f) =>
    f.pergunta.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#12111a] flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />
      <Navbar titulo="Conectar" onMenuAbrir={() => setMenuAberto(true)} />

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-white font-black text-xl uppercase tracking-widest">Ajuda</h1>

        <div className="flex items-center gap-3 bg-[#1e1b2e] rounded-2xl px-4 py-3">
          <MagnifyingGlassIcon className="size-5 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar dúvida..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent flex-1 text-white text-sm placeholder-gray-500 outline-none"
          />
        </div>

        <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">
          Perguntas frequentes
        </p>

        <div className="flex flex-col gap-2">
          {faqsFiltrados.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">Nenhuma dúvida encontrada.</p>
          )}
          {faqsFiltrados.map((faq) => (
            <div key={faq.id} className="bg-[#1e1b2e] rounded-2xl overflow-hidden">
              <button
                onClick={() => setAberto(aberto === faq.id ? null : faq.id)}
                className="flex items-center justify-between w-full px-4 py-3 text-left"
              >
                <p className="text-white text-sm font-bold flex-1 pr-2">{faq.pergunta}</p>
                <ChevronDownIcon
                  className={`size-4 text-emerald-500 shrink-0 transition-transform ${
                    aberto === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {aberto === faq.id && (
                <div className="px-4 pb-4 border-t border-[#2e2b42]">
                  <p className="text-gray-300 text-sm leading-relaxed pt-3">{faq.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#1e1b2e] rounded-2xl p-4 flex flex-col gap-1 mt-2">
          <p className="text-white text-sm font-bold">Ainda com dúvidas?</p>
          <p className="text-gray-400 text-xs">
            Entre em contato com o suporte pelo e-mail{" "}
            <span className="text-emerald-400">suporte@conectelo.com.br</span>
          </p>
        </div>
      </div>
    </div>
  );
}
