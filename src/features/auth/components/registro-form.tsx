import { useState } from "react";
import { FormField } from "../../../components/form-field";
import { Button } from "../../../components/button";
import { useRegistro } from "../hooks/use-registro";

export function RegistroForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const { registro, isLoading, erros } = useRegistro();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registro({ email, password, confirmarSenha });
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <FormField label="E-mail" erro={erros.email}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="seu@email.com"
        />
      </FormField>

      <FormField label="Senha" erro={erros.password}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
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
