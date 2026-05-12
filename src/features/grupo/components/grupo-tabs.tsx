interface Props {
  abaAtiva: "chat" | "eventos";
  onMudar: (aba: "chat" | "eventos") => void;
  quantidadeEventos?: number;
}

export function GrupoTabs({ abaAtiva, onMudar, quantidadeEventos }: Props) {
  const abas = [
    { key: "chat" as const, label: "Chat" },
    { key: "eventos" as const, label: quantidadeEventos ? `Eventos (${quantidadeEventos})` : "Eventos" },
  ];

  return (
    <div className="flex bg-[#1e1b2e] border-b border-white/10">
      {abas.map((aba) => (
        <button
          key={aba.key}
          onClick={() => onMudar(aba.key)}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            abaAtiva === aba.key ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {aba.label}
          {abaAtiva === aba.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
