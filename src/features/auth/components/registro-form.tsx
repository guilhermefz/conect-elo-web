import { useState } from "react";
import { FormField } from "../../../components/form-field";
import { Button } from "../../../components/button";
import { useRegistro } from "../hooks/use-registro";

const OPCOES_GENERO = [
  { valor: 3, label: "Prefiro não informar" },
  { valor: 0, label: "Masculino" },
  { valor: 1, label: "Feminino" },
  { valor: 2, label: "Neutro" },
];

export function RegistroForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState(3);
  const { registro, isLoading, erros } = useRegistro();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registro({ nome, email, password, confirmarSenha, dataNascimento, genero });
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <FormField label="Nome" erro={erros.nome}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass}
          placeholder="Seu nome completo"
        />
      </FormField>

      <FormField label="E-mail" erro={erros.email}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="seu@email.com"
        />
      </FormField>

      <FormField label="Data de nascimento" erro={erros.dataNascimento}>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className={inputClass}
          max={new Date().toISOString().split("T")[0]}
        />
      </FormField>

      <FormField label="Gênero" erro={undefined}>
        <select
          value={genero}
          onChange={(e) => setGenero(Number(e.target.value))}
          className={`${inputClass} cursor-pointer`}
        >
          {OPCOES_GENERO.map((op) => (
            <option key={op.valor} value={op.valor} className="bg-surface text-white">
              {op.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Senha" erro={erros.password}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Ex: Senha@123"
        />
      </FormField>

      <FormField label="Confirmar Senha" erro={erros.confirmarSenha}>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className={inputClass}
          placeholder="Repita a senha"
        />
      </FormField>

      <Button disabled={isLoading} className="mt-2 w-full justify-center">
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
