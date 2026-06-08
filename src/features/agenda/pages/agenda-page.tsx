import { useState } from "react"
import { MenuLateral } from "../../../components/menu-lateral"
import { useLogout } from "../../../hooks/useLogout"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

type TipoEvento = "evento" | "sorteio" | "prazo" | "lembrete"

interface EventoMock {
  dia: number
  mes: number
  ano: number
  tipo: TipoEvento
  titulo: string
  grupo: string
  hora: string | null
  descricao: string
}

const MOCK: EventoMock[] = [
  { dia: 5, mes: 5, ano: 2026, tipo: "sorteio", titulo: "Sorteio do Amigo Secreto", grupo: "Galera da faculdade", hora: "20:00", descricao: "O sistema sorteia os pares automaticamente às 20h." },
  { dia: 7, mes: 5, ano: 2026, tipo: "evento", titulo: "Aniversário da Marina", grupo: "Galera da faculdade", hora: "19:00", descricao: "Pinheiros, SP" },
  { dia: 12, mes: 5, ano: 2026, tipo: "prazo", titulo: "Prazo lista de presentes", grupo: "Galera da faculdade", hora: null, descricao: "Último dia para reservar um item na lista de desejos." },
  { dia: 20, mes: 5, ano: 2026, tipo: "evento", titulo: "Churrasco da Família", grupo: "Família", hora: "13:00", descricao: "Churras anual! Tragam a bebida." },
  { dia: 28, mes: 5, ano: 2026, tipo: "lembrete", titulo: "Confirmar presença no aniversário", grupo: "Galera da faculdade", hora: null, descricao: "Não esqueça de confirmar sua presença!" },
]

const tipoConfig: Record<TipoEvento, { dot: string; bg: string; texto: string; emoji: string; label: string }> = {
  evento:    { dot: "bg-emerald-400", bg: "bg-emerald-500/20", texto: "text-emerald-400", emoji: "🎂", label: "EVENTO" },
  sorteio:   { dot: "bg-yellow-400",  bg: "bg-yellow-500/20",  texto: "text-yellow-400",  emoji: "🎁", label: "SORTEIO" },
  prazo:     { dot: "bg-red-400",     bg: "bg-red-500/20",     texto: "text-red-400",     emoji: "⏰", label: "PRAZO" },
  lembrete:  { dot: "bg-blue-400",    bg: "bg-blue-500/20",    texto: "text-blue-400",    emoji: "📌", label: "LEMBRETE" },
}

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"]
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]

const hoje = new Date()

export function AgendaPage() {
  const logout = useLogout()
  const [menuAberto, setMenuAberto] = useState(false)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null)

  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const primeiroDia = new Date(ano, mes, 1).getDay()

  const eventosDomes = MOCK.filter(e => e.mes === mes && e.ano === ano)
  const eventosDoDia = eventosDomes.filter(e => e.dia === diaSelecionado)
  const totalMes = eventosDomes.length

  function eventosNoDia(dia: number) {
    return eventosDomes.filter(e => e.dia === dia)
  }

  function navegarMes(direcao: number) {
    const novaData = new Date(ano, mes + direcao, 1)
    setAno(novaData.getFullYear())
    setMes(novaData.getMonth())
    setDiaSelecionado(null)
  }

  function nomeDiaSelecionado() {
    if (!diaSelecionado) return ""
    return new Date(ano, mes, diaSelecionado).toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "long"
    })
  }

  const ehHoje = (dia: number) =>
    dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()

  const ehHojeEvento = (e: EventoMock) =>
    e.dia === hoje.getDate() && e.mes === hoje.getMonth() && e.ano === hoje.getFullYear()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <button onClick={() => setMenuAberto(true)}>
          <Bars3Icon className="size-6 text-white" />
        </button>
      </div>

      <div className="px-4 pb-2">
        <h1 className="text-white font-black text-2xl">Agenda</h1>
        <p className="text-gray-400 text-sm">
          {totalMes} compromisso{totalMes !== 1 ? "s" : ""} em {MESES[mes]}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">

        {/* Calendário */}
        <div className="bg-surface rounded-2xl p-4">

          {/* Navegação do mês */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navegarMes(-1)}
              className="size-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ChevronLeftIcon className="size-4 text-white" />
            </button>
            <span className="text-white font-semibold">
              {MESES[mes]} {ano}
            </span>
            <button
              onClick={() => navegarMes(1)}
              className="size-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ChevronRightIcon className="size-4 text-white" />
            </button>
          </div>

          {/* Cabeçalho dias da semana */}
          <div className="grid grid-cols-7 mb-2">
            {DIAS_SEMANA.map((d, i) => (
              <span key={i} className="text-center text-gray-500 text-xs font-semibold py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: primeiroDia }).map((_, i) => (
              <div key={`vazio-${i}`} />
            ))}

            {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
              const eventos = eventosNoDia(dia)
              const selecionado = diaSelecionado === dia
              const isHoje = ehHoje(dia)

              return (
                <button
                  key={dia}
                  onClick={() => setDiaSelecionado(selecionado ? null : dia)}
                  className="flex flex-col items-center py-1"
                >
                  <span className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                    ${isHoje ? "bg-emerald-500 text-white" : ""}
                    ${selecionado && !isHoje ? "bg-white/20 text-white" : ""}
                    ${!isHoje && !selecionado ? "text-white" : ""}
                  `}>
                    {dia}
                  </span>
                  {/* Dots dos eventos */}
                  <div className="flex gap-0.5 mt-0.5 h-1.5">
                    {eventos.slice(0, 3).map((e, i) => (
                      <span key={i} className={`size-1.5 rounded-full ${tipoConfig[e.tipo].dot}`} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-white/10">
            {(Object.entries(tipoConfig) as [TipoEvento, typeof tipoConfig[TipoEvento]][]).map(([tipo, cfg]) => (
              <div key={tipo} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${cfg.dot}`} />
                <span className="text-gray-400 text-xs capitalize">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhe do dia selecionado */}
        <div className={`flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
          diaSelecionado && eventosDoDia.length > 0
            ? "opacity-100 max-h-[1000px]"
            : "opacity-0 max-h-0"
        }`}>
          {diaSelecionado && (
            <>
              <p className="text-white font-bold capitalize">
                {nomeDiaSelecionado()}
              </p>

              {eventosDoDia.map((e, i) => {
                const cfg = tipoConfig[e.tipo]
                return (
                  <div key={i} className="bg-surface rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${cfg.texto}`}>
                        <span>{cfg.emoji}</span>
                        {cfg.label}
                      </span>
                      {ehHojeEvento(e) && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="text-white font-black text-lg leading-tight">{e.titulo}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${cfg.texto}`}>{e.grupo}</p>
                    {e.hora && (
                      <p className="text-gray-400 text-sm mt-2">🕐 {e.hora}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">{e.descricao}</p>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Estado vazio — dia sem eventos */}
        <div className={`transition-all duration-300 overflow-hidden ${
          diaSelecionado && eventosDoDia.length === 0
            ? "opacity-100 max-h-20"
            : "opacity-0 max-h-0"
        }`}>
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhum compromisso neste dia.
          </p>
        </div>

      </div>
    </div>
  )
}