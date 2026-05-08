interface Props {
  conteudo: string;
  autor: string;
  horario: string;
  enviada: boolean;
  mostrarAutor: boolean;
}

export function MessageBubble({ conteudo, autor, horario, enviada, mostrarAutor }: Props) {
  if (enviada) {
    return (
      <div className="flex justify-end">
        <div className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%]">
          <p>{conteudo}</p>
          <p className="text-emerald-200 text-[10px] text-right mt-1">{horario}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {mostrarAutor ? (
        <div className="size-7 rounded-full bg-gray-600 shrink-0 flex items-center justify-center text-xs">
          🤝
        </div>
      ) : (
        <div className="size-7 shrink-0" />
      )}
      <div className="bg-[#1e1b2e] text-white text-sm px-4 py-2 rounded-2xl rounded-bl-sm max-w-[75%]">
        {mostrarAutor && autor && (
          <p className="text-emerald-400 text-[10px] font-bold uppercase mb-1">{autor}</p>
        )}
        <p>{conteudo}</p>
        <p className="text-gray-500 text-[10px] text-right mt-1">{horario}</p>
      </div>
    </div>
  );
}
