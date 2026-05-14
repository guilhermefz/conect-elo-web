import { useRef, useState } from "react";
import { Modal } from "../../../components/modal";
import { FormField } from "../../../components/form-field";

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

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff < -60) onMudarAba("chat");
  }

  function handleFechar() {
    setModalAberto(false);
    setTipoSelecionado(null);
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

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <p className="text-4xl">🎉</p>
          <p className="text-white font-bold text-lg">Nenhum evento ainda</p>
          <p className="text-gray-500 text-sm text-center">
            Os eventos do grupo aparecerão aqui.
          </p>
        </div>
      </div>

      {modalAberto && (
        <Modal variante="bottom-sheet" titulo="Novo Evento" onFechar={handleFechar}>
          <FormField label="Tipo de evento">
            <div className="grid grid-cols-2 gap-2">
              {TIPOS_EVENTO.map((tipo) => {
                const selecionado = tipoSelecionado === tipo.key;
                return (
                  <button
                    key={tipo.key}
                    type="button"
                    onClick={() => setTipoSelecionado(tipo.key)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-colors text-left ${
                      selecionado
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-[#12111a] hover:border-white/20"
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

          <FormField label="Nome do evento">
            <input
              type="text"
              placeholder="Ex: Reunião semanal"
              className="bg-[#12111a] text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </FormField>

          <FormField label="Data e hora">
            <input
              type="datetime-local"
              className="bg-[#12111a] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
            />
          </FormField>

          <FormField label="Local (Opcional)">
            <input
              type="text"
              placeholder="Ex: Casa do João, Meet..."
              className="bg-[#12111a] text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </FormField>

          <FormField label="Descrição">
            <textarea
              rows={3}
              placeholder="Detalhes do evento..."
              className="bg-[#12111a] text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </FormField>

          <button className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-bold text-sm mt-2">
            Criar evento
          </button>
        </Modal>
      )}
    </>
  );
}
