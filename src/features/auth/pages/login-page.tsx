import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[400px] space-y-6">

        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-blue-600">
            ConectElo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Organize os seus eventos e conecte-se.
          </p>
        </header>

        <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <LoginForm />
        </section>

        <footer className="text-center text-sm text-gray-500">
          Ainda não tem conta? <a href="#" className="font-semibold text-blue-600 hover:underline">Registe-se</a>
        </footer>
      </div>
    </main>
  );
}