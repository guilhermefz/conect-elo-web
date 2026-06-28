import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, GiftIcon, LinkIcon } from "@heroicons/react/24/outline";
import {
  buscarMeuResultado,
  type ResultadoComoPresenteador,
} from "../services/amigo-secreto-service";

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function avatarColor(nome: string) {
  return AVATAR_COLORS[nome.charCodeAt(0) % AVATAR_COLORS.length];
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export function AmigoSecretoDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [amigoSecreto, setAmigoSecreto] = useState<ResultadoComoPresenteador | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setCarregando(true);
    buscarMeuResultado(id)
      .then((resultado) => {
        setAmigoSecreto(resultado.comoPresenteador ?? null);
        setErro(null);
      })
      .catch(() => setErro("Não foi possível carregar o seu amigo secreto."))
      .finally(() => setCarregando(false));
  }, [id]);

  const nome = amigoSecreto?.nomeRecebedor ?? "";
  const lista = amigoSecreto?.listaDesejos;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* ── CABEÇALHO ── */}
      <header className="flex items-center gap-3 border-b border-white/[0.07] px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
        >
          <ChevronLeftIcon className="h-6 w-6" strokeWidth={1.8} />
        </button>

        {nome && (
          <>
            {amigoSecreto?.fotoRecebedor ? (
              <img
                src={amigoSecreto.fotoRecebedor}
                alt={nome}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(nome)}`}
              >
                {iniciais(nome)}
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-white">
                {nome}
              </span>
              <span className="text-xs font-medium text-blue-400">
                seu amigo secreto
              </span>
            </div>
          </>
        )}
      </header>

      {/* ── CONTEÚDO ── */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {carregando && (
          <p className="text-sm text-white/[0.55]">Carregando…</p>
        )}

        {!carregando && erro && (
          <p className="text-sm text-red-400">{erro}</p>
        )}

        {!carregando && !erro && lista && (
          <section className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <GiftIcon className="size-5 text-amber-300" />
              {lista.titulo || "Lista de desejos"}
            </h2>

            {lista.itens.length === 0 ? (
              <p className="text-sm text-white/[0.55]">
                Nenhum item na lista de desejos ainda.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {lista.itens.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-surface p-3"
                  >
                    <span className="text-sm text-white">{item.descricao}</span>
                    {item.urlReference && (
                      <a
                        href={item.urlReference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                      >
                        <LinkIcon className="size-4" />
                        Ver
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {!carregando && !erro && !lista && nome && (
          <p className="text-sm text-white/[0.55]">
            Esta pessoa ainda não montou uma lista de desejos.
          </p>
        )}
      </div>
    </div>
  );
}
