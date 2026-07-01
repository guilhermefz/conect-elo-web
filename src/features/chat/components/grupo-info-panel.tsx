import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, LockClosedIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon, LinkIcon } from "@heroicons/react/24/outline";
import { CameraIcon, PencilSquareIcon, ArrowRightStartOnRectangleIcon, Square2StackIcon } from "@heroicons/react/24/solid";
import { atualizarFotoGrupo, buildFotoGrupoUrl, type GrupoDetalhes, type ConviteGerado, sairDoGrupo } from "../../grupo/services/grupo-service";
import { useToast } from "../../../components/toast";
import { ModalGerarConvite } from "../../grupo/components/modal-gerar-convite";
import { Button } from "../../../components/button";
import { Modal } from "../../../components/modal";

interface Props {
  grupoId: string;
  aberto: boolean;
  onFechar: () => void;
  detalhes: GrupoDetalhes | null;
  onFotoAtualizada?: (novaUrl: string) => void;
}

export function GrupoInfoPanel({ grupoId, aberto, onFechar, detalhes, onFotoAtualizada }: Props) {
  const navigate = useNavigate();
  const toast = useToast();
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [convite, setConvite] = useState<ConviteGerado | null>(null);
  const [modalConviteAberto, setModalConviteAberto] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  useEffect(() => {
    setFotoUrl(detalhes?.imgGrupo ? buildFotoGrupoUrl(detalhes.imgGrupo) : null);
  }, [detalhes?.imgGrupo]);

  useEffect(() => {
    if (detalhes?.codigoConvite) {
      setConvite({
        codigo: detalhes.codigoConvite,
        tipoExpiracao: 0,
        expiraEm: detalhes.dataExpiracaoConvite ?? null,
      });
    } else {
      setConvite(null);
    }
  }, [detalhes?.codigoConvite, detalhes?.dataExpiracaoConvite]);

  function conviteExpirado(expiraEm: string | null): boolean {
  if (!expiraEm) return false;
  return new Date(expiraEm) < new Date();
}

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErroFoto(null);
    try {
      const url = await atualizarFotoGrupo(grupoId, file);
      const novaUrl = `${buildFotoGrupoUrl(url)}?t=${Date.now()}`;
      setFotoUrl(null);
      setTimeout(() => setFotoUrl(novaUrl), 0);
      onFotoAtualizada?.(url);
      toast.sucesso("Foto do grupo atualizada com sucesso!");
    } catch {
      setErroFoto("Erro ao enviar foto (máx. 5MB, JPG/PNG/WebP).");
    } finally {
      e.target.value = "";
    }
  }

  async function handleSairDoGrupo() {
    try{
      await sairDoGrupo(grupoId);
      setConfirmarSaida(false);
      navigate("/grupos", {state: { mensagem: "Você saiu do grupo com sucesso!" }});
    }
    catch (error: any) {
      const mensagem = error?.message ?? "Erro ao sair do grupo, tente novamente.";
      setConfirmarSaida(false);
      toast.erro(mensagem);
    }
  }

  return (
    <div
      className={`absolute inset-0 bg-background z-20 flex flex-col transition-transform duration-300 ${
        aberto ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-subtle">
        <p className="text-white font-bold text-sm">Informações do grupo</p>
        <button onClick={onFechar} className="text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!detalhes && (
          <p className="text-gray-400 text-sm text-center mt-10">Carregando...</p>
        )}

        {detalhes && (
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
              <button
                onClick={() => navigate(`/grupos/${grupoId}/editar`)}
                className="flex items-center gap-2 bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-full px-6 py-2.5 text-xs hover:bg-emerald-400 transition-colors"
              >
                <PencilSquareIcon className="size-4" />
                Editar grupo
              </button>

              <button onClick={() => setModalConviteAberto(true)}
                className="flex items-center gap-2 border border-emerald-500 text-emerald-400 font-bold uppercase tracking-widest rounded-full px-6 py-2.5 text-xs hover:bg-emerald-500/10 transition-colors">
                <LinkIcon className="size-4" /> Criar link de convite
              </button>

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

              {convite && (
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Código de convite</p>

                  <div className="flex items-center gap-2">
                    <p className="text-emerald-400 text-sm font-mono">{convite.codigo}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(convite.codigo);
                        toast.sucesso("Código copiado!");
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copiar código"
                    >
                      <Square2StackIcon  className="size-4" />
                    </button>
                  </div>

                  <p className="text-xs">
                    {convite.expiraEm === null ? (
                      <span className="text-gray-400">Sem expiração</span>
                    ) : conviteExpirado(convite.expiraEm) ? (
                      <span className="text-red-400">Expirado</span>
                    ) : (
                      <span className="text-gray-400">
                        Expira em {new Date(convite.expiraEm).toLocaleString("pt-BR")}
                      </span>
                    )}
                  </p>
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
                  <div key={membro.usuarioId} className="flex items-center justify-between py-2 border-b border-subtle last:border-0">
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
              <Button variante = "danger" className="mt-4" onClick={() => setConfirmarSaida(true)}>
                <ArrowRightStartOnRectangleIcon  className="size-4" />
                Sair do grupo
              </Button>
            </div>
          </div>
        )}
      </div>
      {confirmarSaida && (
        <Modal titulo="Sair do grupo" onFechar={() => setConfirmarSaida(false)} variante="centro">
          <p className="text-gray-400 text-sm">Tem certeza que deseja sair do grupo? Você precisará de um novo convite para entrar novamente.</p>
          <div className="flex flex-col gap-2 mt-4">
            <Button variante="danger" onClick={handleSairDoGrupo}>Sim, sair do grupo</Button>
            <Button variante="primary" onClick={() => setConfirmarSaida(false)}>Cancelar</Button>
          </div>
        </Modal>
      )}
        {modalConviteAberto && (
          <ModalGerarConvite
            grupoId={grupoId}
            onFechar={() => setModalConviteAberto(false)}
            onGerado={(c) => setConvite(c)}
          />
        )}
    </div>
  );
}
