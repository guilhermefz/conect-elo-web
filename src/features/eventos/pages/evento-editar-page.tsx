import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { buscarEventoPorId, adicionarItemListaDesejos, removerItemListaDesejos, type ExibirEvento, type ExibirItemListaDesejos } from "../services/evento-service";
import { getUsuarioIdFromToken } from "../../../lib/jwt";

export function EventoEditarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meuId = useMemo(() => getUsuarioIdFromToken() ?? "", []);

  const [evento, setEvento] = useState<ExibirEvento | null>(null);
  const [itens, setItens] = useState<ExibirItemListaDesejos[]>([]);
  const [novoItem, setNovoItem] = useState({ descricao: "", urlReference: "" });
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    if (!id) return;
    buscarEventoPorId(id).then((ev) => {
      if (ev.criador !== meuId) {
        navigate(-1);
        return;
      }
      setEvento(ev);
      setItens(ev.listaDesejos?.itens ?? []);
    });
  }, [id, meuId]);

  async function handleAdicionarItem() {
    if (!novoItem.descricao.trim() || !evento?.listaDesejos) return;
    setAdicionando(true);
    try {
      const item = await adicionarItemListaDesejos(evento.listaDesejos.id, {
        descricao: novoItem.descricao.trim(),
        urlReference: novoItem.urlReference.trim() || undefined,
      });
      setItens((prev) => [...prev, item]);
      setNovoItem({ descricao: "", urlReference: "" });
    } finally {
      setAdicionando(false);
    }
  }

  async function handleRemoverItem(itemId: string) {
    await removerItemListaDesejos(itemId);
    setItens((prev) => prev.filter((i) => i.id !== itemId));
  }

  if (!evento) return null;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="size-9 flex items-center justify-center rounded-xl bg-white/5 text-white"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <span className="text-white font-bold text-sm uppercase tracking-widest">Editar Evento</span>
      </div>

      <div className="flex flex-col gap-6 px-4 py-6">
        <h2 className="text-white font-semibold text-base">{evento.titulo}</h2>

        {evento.listaDesejos && (
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              🎁 Lista de desejos
              <span className="text-gray-500 text-xs font-normal">— {evento.listaDesejos.titulo}</span>
            </h3>

            {/* Itens existentes */}
            <div className="flex flex-col gap-2">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <p className="text-white text-sm">{item.descricao}</p>
                    {item.urlReference && (
                      <a
                        href={item.urlReference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs truncate hover:underline"
                      >
                        {item.urlReference}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoverItem(item.id)}
                    className="shrink-0 size-8 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Formulário de novo item */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Novo item</p>
              <input
                type="text"
                placeholder="Descrição do presente"
                value={novoItem.descricao}
                onChange={(e) => setNovoItem((p) => ({ ...p, descricao: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-white/30"
              />
              <input
                type="url"
                placeholder="URL de referência (opcional)"
                value={novoItem.urlReference}
                onChange={(e) => setNovoItem((p) => ({ ...p, urlReference: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-white/30"
              />
              <button
                onClick={handleAdicionarItem}
                disabled={adicionando || !novoItem.descricao.trim()}
                className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-sm disabled:opacity-40 transition-opacity"
              >
                {adicionando ? "Adicionando..." : "Adicionar item"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}