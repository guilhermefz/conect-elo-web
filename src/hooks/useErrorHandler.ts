import { useState } from "react"

export function useErrorHandler() {
  const [erro, setErro] = useState<string | null>(null)

  function capturarErro(err: unknown) {
    if (err instanceof Error) {
      setErro(err.message)
    } else {
      setErro("Ocorreu um erro inesperado.")
    }
  }

  function limparErro() {
    setErro(null)
  }

  return { erro, capturarErro, limparErro }
}
