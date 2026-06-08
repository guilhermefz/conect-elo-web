import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid"

type Variante = "sucesso" | "erro" | "aviso"

interface ToastItem {
  id: number
  mensagem: string
  variante: Variante
}

interface ToastContextType {
  sucesso: (mensagem: string) => void
  erro: (mensagem: string) => void
  aviso: (mensagem: string) => void
}

const config = {
  sucesso: {
    border: "border-emerald-500",
    bg: "bg-emerald-500/20",
    icon: <CheckCircleIcon className="size-5 text-emerald-400" />,
    titulo: "Sucesso",
  },
  erro: {
    border: "border-red-500",
    bg: "bg-red-500/20",
    icon: <XCircleIcon className="size-5 text-red-400" />,
    titulo: "Erro",
  },
  aviso: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/20",
    icon: <ExclamationTriangleIcon className="size-5 text-yellow-400" />,
    titulo: "Aviso",
  },
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((mensagem: string, variante: Variante) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, mensagem, variante }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const value = useMemo(() => ({
    sucesso: (m: string) => show(m, "sucesso"),
    erro: (m: string) => show(m, "erro"),
    aviso: (m: string) => show(m, "aviso"),
  }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 z-50 flex flex-col gap-2 items-center" style={{ transform: "translateX(-50%)" }}>
        {toasts.map(t => {
          const { border, bg, icon, titulo } = config[t.variante]
          return (
            <div
              key={t.id}
              className={`toast-enter flex items-center gap-3 bg-surface border ${border} text-white px-5 py-4 rounded-xl shadow-2xl min-w-72`}
            >
              <div className={`size-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{titulo}</span>
                <span className="text-xs text-gray-400">{t.mensagem}</span>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider")
  return ctx
}