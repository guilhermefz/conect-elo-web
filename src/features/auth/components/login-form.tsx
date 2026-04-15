import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="******"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 active:scale-95 transition-transform"
      >
        Entrar
      </button>
    </form>
  );
}