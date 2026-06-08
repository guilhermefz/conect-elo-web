import api from "../../../lib/axios";

export interface NotificacaoDto {
    id: string
    usuarioId: string
    conteudo: string
    linkUrl: string
    notificacaoLida: boolean
    dataEnvio: string
    tipoNotificacao: number
}

export async function listarAvisos(): Promise<NotificacaoDto[]> {
    const { data } = await api.get("/api/Notificacoes")
    return data.dados
}

export async function marcarComoLido(id:string): Promise<void> {
    await api.put(`/api/Notificacoes/${id}/Marcar`)
}