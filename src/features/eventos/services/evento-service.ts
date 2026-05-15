import api from "../../../lib/axios"

export interface CriarAniversarioPayload {
    titulo: string;
    descricao?: string;
    dataInicio?: string;
    localizacao?: string;
    grupoId: string;
    nomeAniversariante: string;
    idade?: number;
}

export interface ExibirEventoResumo {
    id: string;
    titulo: string;
    descricao?: string;
    dataInicio?: string;
    localizacao?: string;
    tipoEvento: string | number;
    dataCriacao: string;
}
    
export async function CriarAniversario(payload:CriarAniversarioPayload): Promise<void> {
    await api.post("/api/Eventos/Aniversario", payload)
}

export async function listarEventosPorGrupo(grupoId: string): Promise<ExibirEventoResumo[]> {
    const response = await api.get(`/api/Eventos/ListarPorGrupo/${grupoId}`);
    return response.data.dados ?? [];
}
