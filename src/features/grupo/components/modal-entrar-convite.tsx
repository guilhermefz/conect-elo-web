import { useState } from "react";
import { entrarPorConvite, type GrupoResumo } from "../services/grupo-service";
import { Modal } from "../../../components/modal";

interface Props {
    onFechar: () => void;
    onEntrou: (grupo: GrupoResumo) => void;
}

export function ModalEntrarConvite({ onFechar, onEntrou }: Props) {
    const [codigo, setCodigo] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit() {
        if (!codigo.trim()) return;

        setErro("");
        setCarregando(true);
        try {
            const grupo = await entrarPorConvite(codigo.trim());
            onEntrou(grupo);
        } catch {
            setErro("Convite inválido ou expirado.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Modal titulo="Entrar em um grupo" onFechar={onFechar}>
            <p className="text-gray-400 text-sm">Digite o código de convite do grupo.</p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-3">
                <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: A7BX3KM2"
                    maxLength={8}
                    className="bg-[#12111a] text-white text-center text-xl font-bold tracking-widest rounded-xl px-4 py-3 outline-none border border-transparent focus:border-emerald-500 transition-colors placeholder:text-gray-600"
                />
                {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
                <button
                    type="submit"
                    disabled={carregando || codigo.length < 8}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                >
                    {carregando ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </Modal>
    );
}