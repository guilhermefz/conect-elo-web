import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MenuLateral } from "../../../components/menu-lateral"
import { useLogout } from "../../../hooks/useLogout"
import { buscarTelaInicial, type TelaInicialDto } from "../services/home-service"
import {
  CalendarDaysIcon,
  MapPinIcon,
  BellIcon,
  ChevronRightIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline"

function saudacao() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function nomeDoToken(): string {
  const token = localStorage.getItem("token")
  if (!token) return ""
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(decodeURIComponent(escape(atob(base64))))
    return payload.name ?? ""
  } catch {
    return ""
  }
}

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `Há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Há ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return "Ontem"
  return `Há ${d} dias`
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const confirmacaoLabel: Record<number, { texto: string; cor: string }> = {
  1: { texto: "✓ Você vai", cor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500" },
  3: { texto: "Talvez", cor: "bg-yellow-500/20 text-yellow-400 border border-yellow-500" },
  2: { texto: "✗ Não vai", cor: "bg-red-500/20 text-red-400 border border-red-500" },
}

export function HomePage() {
  const logout = useLogout()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const [dados, setDados] = useState<TelaInicialDto | null>(null)

  useEffect(() => {
    buscarTelaInicial().then(setDados).catch(console.error)
  }, [])

  const nome = nomeDoToken()
  const confirmacao = dados?.proximoEvento?.minhaConfirmacao != null
    ? confirmacaoLabel[dados.proximoEvento.minhaConfirmacao]
    : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} onSair={logout} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <button onClick={() => setMenuAberto(true)}>
          <Bars3Icon className="size-6 text-white" />
        </button>

        <button onClick={() => navigate("/avisos")} className="relative">
            <BellIcon className="size-6 text-white" />
            {(dados?.contadores.avisosNaoLidos ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                {dados!.contadores.avisosNaoLidos}
                </span>
            )}
        </button>
      </div>

      {/* Saudação */}
      <div className="px-4 pb-4">
        <p className="text-gray-400 text-sm">{saudacao()},</p>
        <p className="text-white text-2xl font-black">{nome} 👋</p>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-8">

        {/* Próximo evento */}
        {dados?.proximoEvento && (
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Seu próximo evento
            </p>
            <div
              className="rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => navigate(`/eventos/${dados.proximoEvento!.id}`)}
            >
              {/* Foto de capa */}
              <div className="relative h-36 bg-surface">
                {dados.proximoEvento.fotoCapaUrl ? (
                  <img
                    src={dados.proximoEvento.fotoCapaUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
                )}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Em {dados.proximoEvento.diasRestantes} dias
                </span>
                {confirmacao && (
                  <span className={`absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${confirmacao.cor}`}>
                    {confirmacao.texto}
                  </span>
                )}
              </div>

              {/* Info do evento */}
              <div className="bg-surface p-4">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {dados.proximoEvento.nomeGrupo}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white text-lg font-black">{dados.proximoEvento.titulo}</p>
                  <ChevronRightIcon className="size-5 text-gray-400 shrink-0" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <CalendarDaysIcon className="size-4 shrink-0" />
                    <span>{formatarData(dados.proximoEvento.dataInicio)}</span>
                  </div>
                  {dados.proximoEvento.localizacao && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <MapPinIcon className="size-4 shrink-0" />
                      <span>{dados.proximoEvento.localizacao}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Atalhos */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Eventos", emoji: "📅", rota: "/eventos", count: dados?.contadores.eventosFuturos },
            { label: "Chats", emoji: "💬", rota: "/grupos", count: 0 },
            { label: "Global", emoji: "🌐", rota: "/global", count: 0 },
            { label: "Agenda", emoji: "🗓️", rota: "/agenda", count: 0 },
          ].map(({ label, emoji, rota, count }) => (
            <button
              key={label}
              onClick={() => navigate(rota)}
              className="bg-surface rounded-2xl p-3 flex flex-col items-center gap-2 relative"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-gray-400 text-xs">{label}</span>
              {(count ?? 0) > 0 && (
                <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Seus grupos */}
        {(dados?.grupos.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                Seus grupos
              </p>
              <button
                onClick={() => navigate("/grupos")}
                className="text-emerald-400 text-xs flex items-center gap-1"
              >
                Ver todos <ChevronRightIcon className="size-3" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {dados!.grupos.map((g) => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/grupos/${g.id}`)}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <div className="size-14 rounded-2xl overflow-hidden bg-surface">
                    {g.fotoUrl ? (
                      <img src={g.fotoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">👥</div>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs max-w-14 text-center leading-tight line-clamp-2">
                    {g.nome}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Atividade recente */}
        {(dados?.atividadesRecentes.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                Atividade recente
              </p>
              <button
                onClick={() => navigate("/avisos")}
                className="text-emerald-400 text-xs flex items-center gap-1"
              >
                Ver tudo <ChevronRightIcon className="size-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {dados!.atividadesRecentes.map((a) => (
                <button
                  key={a.id}
                  onClick={() => a.linkUrl && navigate(a.linkUrl)}
                  className="bg-surface rounded-2xl p-4 flex items-center gap-3 text-left w-full"
                >
                  <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-lg">
                    🎂
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug line-clamp-2">{a.conteudo}</p>
                    <p className="text-emerald-500 text-xs mt-1">{tempoRelativo(a.dataEnvio)}</p>
                  </div>
                  <ChevronRightIcon className="size-4 text-gray-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}