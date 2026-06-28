import { useEffect, useState } from "react";
import { GiftIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  buscarMinhaLista,
  adicionarItemMinhaLista,
  removerItemMinhaLista,
} from "../services/amigo-secreto-service";
import type { ExibirItemListaDesejos } from "../../eventos/services/evento-service";

interface MinhaListaDesejosCardProps {
  eventoId: string;
}

export function MinhaListaDesejosCard({ eventoId }: MinhaListaDesejosCardProps) {
  const [itens, setItens] = useState<ExibirItemListaDesejos[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [adicionando, setAdicionando] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [urlReference, setUrlReference] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    buscarMinhaLista(eventoId)
      .then((lista) => {
        if (ativo) {
          setItens(lista.itens ?? []);
          setErro(null);
        }
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar a sua lista.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [eventoId]);

  async function handleAdicionar() {
    const texto = descricao.trim();
    if (!texto) return;
    setSalvando(true);
    try {
      const item = await adicionarItemMinhaLista(eventoId, {
        descricao: texto,
        urlReference: urlReference.trim() || undefined,
      });
      setItens((prev) => [...prev, item]);
      setDescricao("");
      setUrlReference("");
      setAdicionando(false);
      setErro(null);
    } catch {
      setErro("Não foi possível adicionar o item.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemover(itemId: string) {
    setRemovendoId(itemId);
    try {
      await removerItemMinhaLista(itemId);
      setItens((prev) => prev.filter((i) => i.id !== itemId));
      setErro(null);
    } catch {
      setErro("Não foi possível remover o item.");
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-surface p-4">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-pink-400">
          <GiftIcon className="size-4" />
          Sua lista de desejos
        </span>
        <span className="text-[11px] text-white/[0.42]">
          {itens.length} {itens.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <p className="text-sm leading-[1.5] text-white/[0.55]">
        Quem te tirou vê esta lista. Adicione ideias do que você gostaria de ganhar.
      </p>

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      {carregando ? (
        <p className="text-sm text-white/[0.42]">Carregando…</p>
      ) : (
        itens.length > 0 && (
          <ul className="flex flex-col gap-2">
            {itens.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-background p-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-bold text-white">
                    {item.descricao}
                  </span>
                  {item.urlReference && (
                    <a
                      href={item.urlReference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-xs font-medium text-blue-400 hover:underline"
                    >
                      referência ↗
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemover(item.id)}
                  disabled={removendoId === item.id}
                  aria-label="Remover item"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {/* FORMULÁRIO DE ADIÇÃO */}
      {adicionando ? (
        <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-background p-3">
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="O que você gostaria de ganhar?"
            autoFocus
            className="w-full rounded-lg border border-white/[0.08] bg-surface px-3 py-2 text-sm text-white placeholder:text-white/[0.35] focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="url"
            value={urlReference}
            onChange={(e) => setUrlReference(e.target.value)}
            placeholder="Link de referência (opcional)"
            className="w-full rounded-lg border border-white/[0.08] bg-surface px-3 py-2 text-sm text-white placeholder:text-white/[0.35] focus:border-emerald-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdicionar}
              disabled={salvando || !descricao.trim()}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-[#0b1a14] transition-colors hover:bg-emerald-400 disabled:opacity-50"
            >
              {salvando ? "Salvando…" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdicionando(false);
                setDescricao("");
                setUrlReference("");
              }}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/[0.62] transition-colors hover:bg-white/5"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdicionando(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-3 text-sm font-bold text-emerald-500 transition-colors hover:bg-white/5"
        >
          <PlusIcon className="size-5" />
          Adicionar item
        </button>
      )}
    </div>
  );
}
