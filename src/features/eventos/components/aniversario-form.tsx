import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { FormField } from "../../../components/form-field";
import { EventoBaseForm, type EventoBaseData } from "./evento-base-form";

const INPUT_CLS = "bg-background text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500";

export interface AniversarioData extends EventoBaseData {
  nomeAniversariante: string;
  idade: string;
  itensLista: string[];
}

interface Props {
  data: AniversarioData;
  onChange: (field: keyof AniversarioData, value: string | File | null | string[]) => void;
  erro: string | null;
  enviando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AniversarioForm({ data, onChange, erro, enviando, onSubmit }: Props) {
  function adicionarItem() {
    onChange("itensLista", [...data.itensLista, ""]);
  }

  function atualizarItem(index: number, valor: string) {
    const novos = data.itensLista.map((item, i) => (i === index ? valor : item));
    onChange("itensLista", novos);
  }

  function removerItem(index: number) {
    onChange("itensLista", data.itensLista.filter((_, i) => i !== index));
  }

  return (
    <>
      <EventoBaseForm
        data={data}
        onChange={(field, value) => onChange(field as keyof AniversarioData, value)}
      />

      <FormField label="Nome do aniversariante">
        <input
          type="text"
          placeholder="Digite o nome do aniversariante"
          value={data.nomeAniversariante}
          onChange={(e) => onChange("nomeAniversariante", e.target.value)}
          className={INPUT_CLS}
        />
      </FormField>

      <FormField label="Idade (Opcional)">
        <input
          type="number"
          placeholder="Ex: 30"
          value={data.idade}
          onChange={(e) => onChange("idade", e.target.value)}
          className={INPUT_CLS}
        />
      </FormField>

      <FormField label="Lista de desejos (Opcional)">
        <div className="flex flex-col gap-2">
          {data.itensLista.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Item ${index + 1}`}
                value={item}
                onChange={(e) => atualizarItem(index, e.target.value)}
                className={`flex-1 ${INPUT_CLS}`}
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