import { useState } from "react";
import { FormField } from "../../../components/form-field";
import { Button } from "../../../components/button";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, erro } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <FormField label="E-mail" erro={undefined}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="seu@email.com"
          required
        />
      </FormField>

      <FormField label="Senha" erro={undefined}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••"
          required
        />
      </FormField>

      {erro && (
        <p className="text-red-400 text-sm text-center">{erro}</p>
      )}

      <Button disabled={isLoading} className="mt-2 w-full justify-center">
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
