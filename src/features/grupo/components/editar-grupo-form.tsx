import type { AtualizarGrupoPayload } from "../services/grupo-service";

const inputCls = "bg-[#1e1b2e] text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500";
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400";

interface Props {
  form: AtualizarGrupoPayload;
  setForm: React.Dispatch<React.SetStateAction<AtualizarGrupoPayload>>;
  salvando: boolean;
  erro: string;
  onSubmit: () => void | Promise<void>;
}

export function EditarGrupoForm({ form, setForm, salvando, erro, onSubmit }: Props) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Nome</label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          required
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelCls}>Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="flex items-center justify-between bg-[#1e1b2e] border border-[#2e2b42] rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-300">Privado</p>
          <p className="text-xs text-gray-500">Somente membros convidados podem entrar</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, privado: !f.privado }))}
          className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${form.privado ? "bg-emerald-500" : "bg-gray-600"}`}
          aria-checked={form.privado}
          role="switch"
        >
          <span
            className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform duration-200 ${form.privado ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="mt-2 bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-full py-4 hover:bg-emerald-400 transition-colors disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
