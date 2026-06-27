import { FormField } from "../../../components/form-field";
import { EventoBaseForm, type EventoBaseData } from "../../eventos/components/evento-base-form";

const INPUT_CLS = "bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500";

export interface AmigoSecretoData extends EventoBaseData {
  valor: string;
  dataSorteio: string;
}

interface Props {
  data: AmigoSecretoData;
  onChange: (field: keyof AmigoSecretoData, value: string | File | null) => void;
  erro: string | null;
  enviando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AmigoSecretoForm({ data, onChange, erro, enviando, onSubmit }: Props) {
  return (
    <>
      <EventoBaseForm
        data={data}
        onChange={(field, value) => onChange(field as keyof AmigoSecretoData, value)}
      />

      <FormField label="Data do sorteio">
        <input
          type="datetime-local"
          value={data.dataSorteio}
          onChange={(e) => onChange("dataSorteio", e.target.value)}
          className={`${INPUT_CLS} [color-scheme:dark]`}
        />
      </FormField>

      <FormField label="Valor sugerido (Opcional)">
        <input
          type="number"
          placeholder="Ex: 50"
          value={data.valor}
          onChange={(e) => onChange("valor", e.target.value)}
          className={INPUT_CLS}
        />
      </FormField>

      {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
      <button
        onClick={onSubmit}
        disabled={enviando}
        className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 transition-colors text-white font-bold text-sm"
      >
        {enviando ? "Criando..." : "Criar evento"}
      </button>
    </>
  );
}