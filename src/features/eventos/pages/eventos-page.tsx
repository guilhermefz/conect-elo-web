import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Modal } from "../../../components/modal";
import { FormField } from "../../../components/form-field";
import { CriarAniversario, type ExibirEventoResumo, listarEventosPorGrupo } from "../services/evento-service";
import { EventoCard } from "../components/evento-card";

interface Props {
  onMudarAba: (aba: "chat" | "eventos") => void;
}

const TIPOS_EVENTO = [
  { key: "aniversario", emoji: "🎂", titulo: "Aniversário", descricao: "Celebre com o grupo" },
  { key: "amigo-secreto", emoji: "🎁", titulo: "Amigo Secreto", descricao: "Sorteio anônimo" },
  { key: "reuniao", emoji: "📅", titulo: "Reunião", descricao: "Organize um encontro" },
  { key: "outro", emoji: "🎉", titulo: "Outro", descricao: "Evento personalizado" },
] as const;

type TipoEvento = (typeof TIPOS_EVENTO)[number]["key"];

export function EventosPage({ onMudarAba }: Props) {
  const touchStartX = useRef(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoEvento | null>(null);
  const { id: grupoId } = useParams<{ id: string }>();
  const [etapa, setEtapa] = useState<"tipo" | "aniversario">("tipo");
  const [nomeAniversariante, setNomeAniversariante] = useState("");
  const [idade, setIdade] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [itensLista, setItensLista] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [eventos, setEventos] = useState<ExibirEventoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarEventos() {
    if (!grupoId) return;
    try {
      const lista = await listarEventosPorGrupo(grupoId);
      setEventos(lista);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarEventos(); }, [grupoId]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff < -60) onMudarAba("chat");
  }

  function handleFechar() {
    setModalAberto(false);
    setEtapa("tipo");
    setTipoSelecionado(null);
    setNomeAniversariante("");
    setIdade("");
    setDataInicio("");
    setLocalizacao("");
    setDescricao("");
    setItensLista([]);
    setErro(null);
  }

  function adicionarItem() {
    setItensLista(prev => [...prev, ""]);
  }

  function atualizarItem(index: number, valor: string) {
    setItensLista(prev => prev.map((item, i) => i === index ? valor : item));
  }

  function removerItem(index: number) {
    setItensLista(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grupoId) return;
    if (!nomeAniversariante.trim()) {
      setErro("Informe o nome do aniversariante.");
      return;
    }
    setEnviando(true);
    setErro(null);

    const itensFiltrados = itensLista.filter(i => i.trim());
    try {
      await CriarAniversario({
        titulo: `Aniversário de ${nomeAniversariante.trim()}`,
        grupoId,
        nomeAniversariante: nomeAniversariante.trim(),
        idade: idade ? Number(idade) : undefined,
        dataInicio: dataInicio ? new Date(dataInicio).toISOString() : undefined,
        localizacao: localizacao.trim() || undefined,
        descricao: descricao.trim() || undefined,
        listaDesejos: itensFiltrados.length > 0 ? {
          titulo: "Lista de Desejos",
          itens: itensFiltrados.map(i => ({ descricao: i.trim() })),
        } : undefined,
      });
      handleFechar();

      carregarEventos();
    } catch {
      setErro("Erro ao criar evento. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="px-4 py-3 border-b border-white/10">
          <button
            onClick={() => setModalAberto(true)}
            className="w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-bold text-sm"
          >
            Criar um novo evento
          </button>
        </div>

        {carregando ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Carregando eventos...</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-8">
            <p className="text-4xl">🎉</p>
            <p className="text-white font-bold text-lg">Nenhum evento ainda</p>
            <p className="text-gray-500 text-sm text-center">
              Os eventos do grupo aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {eventos.map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}

      </div>

      {modalAberto && (
        <Modal variante="bottom-sheet"
               titulo={etapa === "tipo" ? "Novo Evento" : "Aniversário 🎂"}
               onFechar={etapa === "aniversario" ? () => setEtapa("tipo") : handleFechar}>

          {etapa === "tipo" && (
            <FormField label="Tipo de evento">
              <div className="grid grid-cols-2 gap-2">
                {TIPOS_EVENTO.map((tipo) => {
                  const selecionado = tipoSelecionado === tipo.key;
                  return (
                    <button
                      key={tipo.key}
                      type="button"
                      onClick={() => {
                        setTipoSelecionado(tipo.key);
                        if (tipo.key === "aniversario") setEtapa("aniversario");
                      }}
                      className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-colors text-left ${
                        selecionado
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/10 bg-background hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl">{tipo.emoji}</span>
                      <span className={`text-sm font-bold ${selecionado ? "text-emerald-400" : "text-white"}`}>
                        {tipo.titulo}
                      </span>
                      <span className="text-gray-500 text-xs">{tipo.descricao}</span>
                    </button>
                  );
                })}
              </div>
            </FormField>
          )}

          {etapa === "aniversario" && (
            <>
              <FormField label="Nome do aniversariante">
                <input
                  type="text"
                  placeholder="Digite o nome do aniversariante"
                  value={nomeAniversariante}
                  onChange={(e) => setNomeAniversariante(e.target.value)}
                  className="bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </FormField>

              <FormField label="Idade (Opcional)">
                <input
                  type="number"
                  placeholder="Ex: 30"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </FormField>

              <FormField label="Data e hora">
                <input
                  type="datetime-local"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="bg-background text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
                />
              </FormField>

              <FormField label="Local (Opcional)">
                <input
                  type="text"
                  placeholder="Ex: Casa do João, Meet..."
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className="bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </FormField>

              <FormField label="Descrição (Opcional)">
                <textarea
                  rows={3}
                  placeholder="Detalhes do evento..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </FormField>

              <FormField label="Lista de desejos (Opcional)">
                <div className="flex flex-col gap-2">
                  {itensLista.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Item ${index + 1}`}
                        value={item}
                        onChange={(e) => atualizarItem(index, e.target.value)}
                        className="flex-1 bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="size-9 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={adicionarItem}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-gray-400 hover:border-white/40 hover:text-white transition-colors text-sm"
                  >
                    <PlusIcon className="size-4" />
                    Adicionar item
                  </button>
                </div>
              </FormField>

              {erro && <p className="text-red-400 text-sm text-center -mt-1">{erro}</p>}

              <button
                onClick={handleSubmit}
                disabled={enviando}
                className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 transition-colors text-white font-bold text-sm mt-2"
              >
                {enviando ? "Criando..." : "Criar evento"}
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
