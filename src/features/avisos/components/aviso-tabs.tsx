export type AbaAvisos = "todos" | "nao-lidos" | "lidos"

interface Props {
  aba: AbaAvisos
  totalNaoLidos: number
  onChange: (aba: AbaAvisos) => void
}

const ABAS: { label: string; value: AbaAvisos }[] = [
  { label: "Todos", value: "todos" },
  { label: "Não lidos", value: "nao-lidos" },
  { label: "Lidos", value: "lidos" },
]

export function AvisosTabs({ aba, totalNaoLidos, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {ABAS.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            aba === item.value
              ? "bg-emerald-500 text-white"
              : "bg-surface text-gray-400 hover:text-white"
          }`}
        >
          {item.label}
          {item.value === "nao-lidos" && totalNaoLidos > 0 && (
            <span className="bg-white/20 text-white text-xs rounded-full px-1.5 leading-none py-px">
              {totalNaoLidos}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}