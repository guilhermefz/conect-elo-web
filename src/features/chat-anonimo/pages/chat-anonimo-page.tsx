import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, EyeSlashIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  obterConversaAnonima,
  type AbaChatAnonimo,
  type MensagemAnonima,
} from "../data/mock";

const ABAS: { chave: AbaChatAnonimo; label: string }[] = [
  { chave: "recebido", label: "Quem te pegou" },
  { chave: "enviado", label: "Quem você pegou" },
];

export function ChatAnonimoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const conversa = obterConversaAnonima(id ?? "");

  const [aba, setAba] = useState<AbaChatAnonimo>("recebido");
  const [threads, setThreads] = useState<Record<AbaChatAnonimo, MensagemAnonima[]>>(
    conversa ? conversa.mensagens : { recebido: [], enviado: [] }
  );
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const mensagens = threads[aba];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [aba, mensagens.length]);

  if (!conversa) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-400 text-sm">Conversa não encontrada.</p>
        <button
          onClick={() => navigate("/grupos")}
          className="text-emerald-400 text-sm font-bold uppercase tracking-widest"
        >
          Voltar
        </button>
      </div>
    );
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo) return;
    setThreads((prev) => ({
      ...prev,
      [aba]: [
        ...prev[aba],
        { id: crypto.randomUUID(), conteudo, enviada: true, horario: "agora" },
      ],
    }));
    setTexto("");
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface">
        <button
          onClick={() => navigate("/grupos")}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <div className="size-9 rounded-full bg-orange-500/20 shrink-0 flex items-center justify-center text-base">
          {conversa.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{conversa.titulo}</p>
          <p className="text-emerald-400 text-[11px]">Chat anônimo</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex bg-surface border-b border-subtle">
        {ABAS.map(({ chave, label }) => (
          <button
            key={chave}
            onClick={() => setAba(chave)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              aba === chave
                ? "text-white border-emerald-500"
                : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {aba === "recebido" && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 bg-surface rounded-full px-3 py-1.5 text-[11px] text-gray-300">
              <EyeSlashIcon className="size-3.5 text-emerald-400" />
              Você ainda não sabe quem te tirou
            </div>
          </div>
        )}

        {mensagens.map((msg) => (
          <BolhaAnonima key={msg.id} mensagem={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Campo de mensagem */}
      <form
        onSubmit={handleEnviar}
        className="flex items-center gap-3 px-4 py-3 bg-background border-t border-surface"
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Mensagem anônima..."
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="size-9 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-colors shrink-0"
          aria-label="Enviar"
        >
          <PaperAirplaneIcon className="size-4" />
        </button>
      </form>
    </div>
  );
}

function BolhaAnonima({ mensagem }: { mensagem: MensagemAnonima }) {
  if (mensagem.enviada) {
    return (
      <div className="flex justify-end">
        <div className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%]">
          <p>{mensagem.conteudo}</p>
          <p className="text-emerald-200 text-[10px] text-right mt-1">{mensagem.horario}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="size-7 rounded-full bg-blue-500/30 shrink-0 flex items-center justify-center text-xs">
        🎭
      </div>
      <div className="bg-surface text-white text-sm px-4 py-2 rounded-2xl rounded-bl-sm max-w-[75%]">
        <p>{mensagem.conteudo}</p>
        <p className="text-gray-500 text-[10px] text-right mt-1">{mensagem.horario}</p>
      </div>
    </div>
  );
}
