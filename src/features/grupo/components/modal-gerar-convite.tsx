import { useState } from "react";
import { gerarConvite, type ConviteGerado } from "../services/grupo-service";
import { Modal } from "../../../components/modal";

const OPCOES = [
  { valor: 0, label: "15 minutos" },
  { valor: 1, label: "1 hora" },
  { valor: 2, label: "8 horas" },
  { valor: 3, label: "1 dia" },
  { valor: 4, label: "7 dias" },
  { valor: 5, label: "Sem expiração" },
];

interface Props {
  grupoId: string;
  onFechar: () => void;
  onGerado: (convite: ConviteGerado) => void;
}

export function ModalGerarConvite({ grupoId, onFechar, onGerado }: Props) {
  const [tipoExpiracao, setTipoExpiracao] = useState(4);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit() {
    setErro("");
    setCarregando(true);
    try {
      const convite = await gerarConvite(grupoId, tipoExpiracao);
      onGerado(convite);
    } catch {
      setErro("Erro ao gerar convite. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal titulo="Criar link de convite" onFechar={onFechar}>
      <p className="text-gray-400 text-sm">Selecione o tempo de expiração do convite.</p>
      <div className="flex flex-col gap-2">
        {OPCOES.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => setTipoExpiracao(opcao.valor)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
              tipoExpiracao === opcao.valor
                ? "bg-emerald-500 text-white"
                : "bg-background text-gray-300 hover:bg-white/5"
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>
      {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
      <button
        type="button"
        disabled={carregando}
        onClick={handleSubmit}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
      >
        {carregando ? "Gerando..." : "Gerar convite"}
      </button>
    </Modal>
  );
}