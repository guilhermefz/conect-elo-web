import type { AtualizarPerfilPayload } from "../services/perfil-service";

const GENEROS = [
  { value: 0, label: "Masculino" },
  { value: 1, label: "Feminino" },
  { value: 2, label: "Prefiro não dizer" },
];

const inputCls = "bg-[#1e1b2e] text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500";
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400";

interface Props {
  form: AtualizarPerfilPayload;
  setForm: React.Dispatch<React.SetStateAction<AtualizarPerfilPayload>>;
  salvando: boolean;
  erro: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditarPerfilForm({ form, setForm, salvando, erro, onSubmit }: Props) {
  function campo(key: keyof AtualizarPerfilPayload) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: key === "genero" ? Number(e.target.value) : e.target.value }));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Nome</label>
        <input type="text" value={form.nome} onChange={campo("nome")} required className={inputCls} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelCls}>E-mail</label>
        <input type="email" value={form.email} onChange={campo("email")} required className={inputCls} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Bio</label>
        <textarea value={form.bio} onChange={campo("bio")} rows={3} className={`${inputCls} resize-none`} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Data de nascimento</label>
        <input type="date" value={form.dataNascimento} onChange={campo("dataNascimento")} className={inputCls} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelCls}>Gênero</label>
        <select value={form.genero} onChange={campo("genero")} className={inputCls}>
          {GENEROS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
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
