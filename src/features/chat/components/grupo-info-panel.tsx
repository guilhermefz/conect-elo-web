import { useEffect, useRef, useState } from "react";
import { XMarkIcon, LockClosedIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { obterGrupoPorId, atualizarFotoGrupo, buildFotoGrupoUrl, type GrupoDetalhes } from "../../grupo/services/grupo-service";
import { ToastSucesso } from "../../perfil/components/toast-sucesso";

interface Props {
  grupoId: string;
  aberto: boolean;
  onFechar: () => void;
}

export function GrupoInfoPanel({ grupoId, aberto, onFechar }: Props) {
  const [detalhes, setDetalhes] = useState<GrupoDetalhes | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!aberto) return;
    setCarregando(true);
    setErro(null);
    obterGrupoPorId(grupoId)
      .then((d) => {
        setDetalhes(d);
        setFotoUrl(d.imgGrupo ? buildFotoGrupoUrl(d.imgGrupo) : null);
      })
      .catch(() => setErro("Não foi possível carregar as informações."))
      .finally(() => setCarregando(false));
  }, [grupoId, aberto]);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErroFoto(null);
    try {
      const url = await atualizarFotoGrupo(grupoId, file);
      const novaUrl = buildFotoGrupoUrl(url);
      setFotoUrl(null);
      setTimeout(() => setFotoUrl(novaUrl), 0);
      setToast("Foto do grupo atualizada com sucesso!");
    } catch {
      setErroFoto("Erro ao enviar foto (máx. 5MB, JPG/PNG/WebP).");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div
      className={`absolute inset-0 bg-[#12111a] z-20 flex flex-col transition-transform duration-300 ${
        aberto ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <ToastSucesso mensagem={toast} />
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2d2a3e]">
        <p className="text-white font-bold text-sm">Informações do grupo</p>
        <button onClick={onFechar} className="text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {carregando && (
          <p className="text-gray-400 text-sm text-center mt-10">Carregando...</p>
        )}

        {erro && (
          <p className="text-red-400 text-sm text-center mt-10">{erro}</p>
        )}

        {detalhes && !carregando && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="size-20 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-4xl">
                  {fotoUrl
                    ? <img src={fotoUrl} alt="Foto do grupo" className="size-full object-cover" />
                    : <span>🤝</span>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 size-7 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-colors"
                >
                  <CameraIcon className="size-3.5" />
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFoto}
              />
              {erroFoto && <p className="text-red-400 text-xs text-center">{erroFoto}</p>}
              <p className="text-white font-bold text-base text-center">{detalhes.nome}</p>
            </div>

            {detalhes.descricao && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Descrição</p>
                <p className="text-white text-sm">{detalhes.descricao}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {detalhes.privado ? (
                  <LockClosedIcon className="size-4 text-gray-400 shrink-0" />
                ) : (
                  <GlobeAltIcon className="size-4 text-gray-400 shrink-0" />
                )}
                <p className="text-white text-sm">
                  {detalhes.privado ? "Grupo privado" : "Grupo público"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="size-4 text-gray-400 shrink-0" />
                <p className="text-white text-sm">
                  Criado em {new Date(detalhes.dataCriacao).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {detalhes.codigoConvite && (
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Código de convite</p>
                  <p className="text-emerald-400 text-sm font-mono">{detalhes.codigoConvite}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="size-4 text-gray-400 shrink-0" />
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Membros ({detalhes.membros.length})
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {detalhes.membros.map((membro) => (
                  <div key={membro.usuarioId} className="flex items-center justify-between py-2 border-b border-[#2d2a3e] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs shrink-0">
                        🤝
                      </div>
                      <div className="flex flex-col">
                        <p className="text-white text-sm">{membro.nomeUsuario}</p>
                        <p className="text-gray-500 text-[10px]">
                          Entrou em {new Date(membro.dataEntrada).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    {membro.usuarioId === detalhes.proprietarioId && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Admin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
