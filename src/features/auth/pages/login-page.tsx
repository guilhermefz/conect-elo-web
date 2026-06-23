import { Link } from "react-router-dom";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] space-y-6">

        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
            ConectElo
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Organize os seus eventos e conecte-se.
          </p>
        </header>

        <section className="rounded-xl bg-surface p-6 shadow-sm border border-white/5">
          <LoginForm />
        </section>

        <footer className="text-center text-sm text-gray-500">
          Ainda não tem conta?{" "}
          <Link to="/registro" className="font-semibold text-emerald-400 hover:underline">
            Registre-se
          </Link>
        </footer>
      </div>
    </main>
  );
}