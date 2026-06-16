import { FormField } from "../../../components/form-field";

const INPUT_CLS = "bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500";

export interface EventoBaseData {
  titulo: string;
  descricao: string;
  dataInicio: string;
  localizacao: string;
  fotoCapa: File | null;
  previewCapa: string | null;
}

interface Props {
  data: EventoBaseData;
  onChange: (field: keyof EventoBaseData, value: string | File | null) => void;
}

export function EventoBaseForm({ data, onChange }: Props) {
  function handleFotoCapa(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange("fotoCapa", file);
    onChange("previewCapa", URL.createObjectURL(file));
  }

  return (
    <>
      <FormField label="Foto de capa (Opcional)">
        <label className="cursor-pointer block">
          {data.previewCapa ? (
            <div className="relative">
              <img src={data.previewCapa} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
              <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                Trocar
              </span>
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-white/40 hover:text-gray-400 transition-colors">
              <span className="text-2xl">🖼️</span>
              <span className="text-xs">Toque para adicionar uma capa</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFotoCapa} />
        </label>
      </FormField>

      <FormField label="Título">
        <input
          type="text"
          placeholder="Título do evento"
          value={data.titulo}
          onChange={(e) => onChange("titulo", e.target.value)}
          className={INPUT_CLS}
          autoFocus
        />
      </FormField>

      <FormField label="Data e hora">
        <input
          type="datetime-local"
          value={data.dataInicio}
          onChange={(e) => onChange("dataInicio", e.target.value)}
          className={`${INPUT_CLS} [color-scheme:dark]`}
        />
      </FormField>

      <FormField label="Local (Opcional)">
        <input
          type="text"
          placeholder="Ex: Casa do João, Meet..."
          value={data.localizacao}
          onChange={(e) => onChange("localizacao", e.target.value)}
          className={INPUT_CLS}
        />
      </FormField>

      <FormField label="Descrição (Opcional)">
        <textarea
          rows={3}
          placeholder="Detalhes do evento..."
          value={data.descricao}
          onChange={(e) => onChange("descricao", e.target.value)}
          className={`${INPUT_CLS} resize-none`}
        />
      </FormField>
    </>
  );
}