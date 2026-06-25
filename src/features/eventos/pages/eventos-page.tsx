import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { FormField } from "../../../components/form-field";
import { CriarAniversario, CriarAmigoSecreto, uploadFotoCapa, type ExibirEventoResumo, listarEventosPorGrupo } from "../services/evento-service";
import { EventoCard } from "../components/evento-card";
import { AniversarioForm, type AniversarioData } from "../components/aniversario-form";
import { AmigoSecretoForm, type AmigoSecretoData } from "../components/amigo-secreto-form";

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

const ANIVERSARIO_INICIAL: AniversarioData = {
  titulo: "", descricao: "", dataInicio: "", localizacao: "",
  fotoCapa: null, previewCapa: null,
  nomeAniversariante: "", idade: "", itensLista: [],
};

const AMIGO_SECRETO_INICIAL: AmigoSecretoData = {
  titulo: "", descricao: "", dataInicio: "", localizacao: "",
  fotoCapa: null, previewCapa: null,
  valor: "", dataSorteio: "",
};

export function EventosPage({ onMudarAba }: Props) {
  const touchStartX = useRef(0);
  const { id: grupoId } = useParams<{ id: string }>();

  const [modalAberto, setModalAberto] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoEvento | null>(null);
  const [etapa, setEtapa] = useState<"tipo" | TipoEvento>("tipo");

  const [aniversarioData, setAniversarioData] = useState<AniversarioData>(ANIVERSARIO_INICIAL);
  const [amigoSecretoData, setAmigoSecretoData] = useState<AmigoSecretoData>(AMIGO_SECRETO_INICIAL);

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
    setAniversarioData(ANIVERSARIO_INICIAL);
    setAmigoSecretoData(AMIGO_SECRETO_INICIAL);
    setErro(null);
  }

  function obterTituloModal() {
    if (etapa === "tipo") return "Novo Evento";
    if (etapa === "aniversario") return "Aniversário 🎂";
    if (etapa === "amigo-secreto") return "Amigo Secreto 🎁";
    return "Novo Evento";
  }

  function handleChangeAniversario(field: keyof AniversarioData, value: string | File | null | string[]) {
    setAniversarioData((prev) => ({ ...prev, [field]: value }));
  }

  function handleChangeAmigoSecreto(field: keyof AmigoSecretoData, value: string | File | null) {
    setAmigoSecretoData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmitAniversario(e: React.FormEvent) {
    e.preventDefault();
    if (!grupoId) return;
    if (!aniversarioData.nomeAniversariante.trim()) {
      setErro("Informe o nome do aniversariante.");
      return;
    }
    setEnviando(true);
    setErro(null);
    const itensFiltrados = aniversarioData.itensLista.filter((i) => i.trim());
    try {
      const id = await CriarAniversario({
        titulo: aniversarioData.titulo.trim() || `Aniversário de ${aniversarioData.nomeAniversariante.trim()}`,
        grupoId,
        nomeAniversariante: aniversarioData.nomeAniversariante.trim(),
        idade: aniversarioData.idade ? Number(aniversarioData.idade) : undefined,
        dataInicio: aniversarioData.dataInicio ? new Date(aniversarioData.dataInicio).toISOString() : undefined,
        localizacao: aniversarioData.localizacao.trim() || undefined,
        descricao: aniversarioData.descricao.trim() || undefined,
        listaDesejos: itensFiltrados.length > 0 ? {
          titulo: "Lista de Desejos",
          itens: itensFiltrados.map((i) => ({ descricao: i.trim() })),
        } : undefined,
      });
      if (aniversarioData.fotoCapa) {
        await uploadFotoCapa(id.id, aniversarioData.fotoCapa);
      }
      handleFechar();
      carregarEventos();
    } catch {
      setErro("Erro ao criar evento. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleSubmitAmigoSecreto(e: React.FormEvent) {
    e.preventDefault();
    if (!grupoId) return;
    if (!amigoSecretoData.titulo.trim()) {
      setErro("Informe o título do evento.");
      return;
    }
    setEnviando(true)
    setErro(null)
    try{
    const id = await CriarAmigoSecreto({
        titulo: amigoSecretoData.titulo.trim(),
        grupoId,
        dataInicio: amigoSecretoData.dataInicio ? new Date(amigoSecretoData.dataInicio).toISOString() : undefined,
        localizacao: amigoSecretoData.localizacao.trim() || undefined,
        descricao: amigoSecretoData.descricao.trim() || undefined,
        valor: amigoSecretoData.valor.trim(),
        dataSorteio: amigoSecretoData.dataSorteio
          ? new Date(amigoSecretoData.dataSorteio).toISOString()
          :undefined,
    });
    if (amigoSecretoData.fotoCapa) {
      await uploadFotoCapa(id.id, amigoSecretoData.fotoCapa)
    }
    handleFechar();
    carregarEventos();
  } catch {
      setErro("Criação de amigo secreto ainda não implementada.");
    }
    finally {
      setEnviando(false)
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
            <p className="text-gray-500 text-sm text-center">Os eventos do grupo aparecerão aqui.</p>
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
        <Modal
          variante="bottom-sheet"
          titulo={obterTituloModal()}
          onFechar={etapa !== "tipo" ? () => setEtapa("tipo") : handleFechar}
        >
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
                        if (tipo.key === "aniversario" || tipo.key === "amigo-secreto") {
                          setEtapa(tipo.key);
                        }
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
            <AniversarioForm
              data={aniversarioData}
              onChange={handleChangeAniversario}
              erro={erro}
              enviando={enviando}
              onSubmit={handleSubmitAniversario}
            />
          )}

          {etapa === "amigo-secreto" && (
            <AmigoSecretoForm
              data={amigoSecretoData}
              onChange={handleChangeAmigoSecreto}
              erro={erro}
              enviando={enviando}
              onSubmit={handleSubmitAmigoSecreto}
            />
          )}
        </Modal>
      )}
    </>
  );
}