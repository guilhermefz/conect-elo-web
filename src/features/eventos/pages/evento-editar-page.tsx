import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { buscarEventoPorId, editarEvento, adicionarItemListaDesejos, removerItemListaDesejos, type ExibirEvento, type ExibirItemListaDesejos } from "../services/evento-service";
import { getUsuarioIdFromToken } from "../../../lib/jwt";
import { uploadFotoCapa } from "../services/evento-service";

export function EventoEditarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meuId = useMemo(() => getUsuarioIdFromToken() ?? "", []);

  const [evento, setEvento] = useState<ExibirEvento | null>(null);
  const [itens, setItens] = useState<ExibirItemListaDesejos[]>([]);
  const [novoItem, setNovoItem] = useState({ descricao: "", urlReference: "" });
  const [adicionando, setAdicionando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [idade, setIdade] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [novaFoto, setNovaFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    buscarEventoPorId(id).then((ev) => {
      if (ev.criador !== meuId) {
        navigate(-1);
        return;
      }
      setEvento(ev);
      setItens(ev.listaDesejos?.itens ?? []);
      setTitulo(ev.titulo);
      setIdade(ev.idade?.toString() ?? "");
      setDescricao(ev.descricao ?? "");
      setLocalizacao(ev.localizacao ?? "");
      setDataInicio(ev.dataInicio ? ev.dataInicio.slice(0, 16) : "");
    });
  }, [id, meuId]);

  async function handleSalvar() {
    if (!evento || !titulo.trim()) return;
    setSalvando(true);
    try {
      await editarEvento({
        id: evento.id,
        titulo: titulo.trim(),
        idade: idade ? Number(idade) : undefined,
        descricao: descricao.trim() || undefined,
        localizacao: localizacao.trim() || undefined,
        dataInicio: dataInicio ? new Date(dataInicio).toISOString() : undefined,
        status: evento.status,
        tipoEvento: evento.tipoEvento,
      });

      if (novaFoto) {
        await uploadFotoCapa(evento.id, novaFoto);
      }
      navigate(-1);
    } finally {
      setSalvando(false);
    }
  }

  function handleSelecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNovaFoto(file);
    setPreviewFoto(URL.createObjectURL(file));
  }

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
        <div className="flex flex-col gap-3">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Informações</p>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xs">Foto de capa</label>
            <label className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer flex items-center justify-center">
              {previewFoto || evento.fotoCapaUrl ? (
                <img
                  src={previewFoto ?? evento.fotoCapaUrl}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Toque para selecionar</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleSelecionarFoto} />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xs">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-white/30"
            />
          </div>

          {evento.tipoEvento === 2 && (
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 text-xs">Idade</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-white/30"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xs">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xs">Local</label>
            <input
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 text-xs">Data e hora</label>
            <input
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-white/30"
            />
          </div>

          <button
            onClick={handleSalvar}
            disabled={salvando || !titulo.trim()}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm disabled:opacity-40 transition-opacity"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>

        {/* Lista de desejos */}
        {evento.listaDesejos && (
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
              Lista de desejos — {evento.listaDesejos.titulo}
            </p>

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
                className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm disabled:opacity-40 transition-opacity hover:bg-white/20"
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