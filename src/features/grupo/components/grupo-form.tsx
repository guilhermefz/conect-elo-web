import { useState } from "react";

export interface GrupoFormData {
  nome: string;
  descricao: string;
  privado: boolean;
}

interface Props {
  onSubmit: (dados: GrupoFormData) => void | Promise<void>;
  loading?: boolean;
  erro?: string;
}

export function GrupoForm({ onSubmit, loading = false, erro }: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [privado, setPrivado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nome, descricao, privado });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-300">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do grupo"
          required
          className="bg-[#1e1b2e] border border-[#2e2b42] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-300">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Sobre o que é esse grupo?"
          rows={3}
          className="bg-[#1e1b2e] border border-[#2e2b42] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        />
      </div>

      <div className="flex items-center justify-between bg-[#1e1b2e] border border-[#2e2b42] rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-300">Privado</p>
          <p className="text-xs text-gray-500">Somente membros convidados podem entrar</p>
        </div>
        <button
          type="button"
          onClick={() => setPrivado((v) => !v)}
          className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${privado ? "bg-emerald-500" : "bg-gray-600"}`}
          aria-checked={privado}
          role="switch"
        >
          <span
            className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform duration-200 ${privado ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {erro && <p className="text-xs text-red-400">{erro}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 disabled:opacity-50 transition-colors"
      >
        {loading ? "Criando..." : "Criar grupo"}
      </button>
    </form>
  );
}
