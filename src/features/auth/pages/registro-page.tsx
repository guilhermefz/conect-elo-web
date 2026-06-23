import { Link } from "react-router-dom";
import { RegistroForm } from "../components/registro-form";

export function RegistroPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] space-y-6">

        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
            ConectElo
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Crie sua conta e comece a se conectar.
          </p>
        </header>

        <section className="rounded-xl bg-surface p-6 shadow-sm border border-white/5">
          <h2 className="mb-5 text-base font-semibold text-white">Criar conta</h2>
          <RegistroForm />
        </section>

        <footer className="text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
            Entrar
          </Link>
        </footer>

      </div>
    </main>
  );
}
