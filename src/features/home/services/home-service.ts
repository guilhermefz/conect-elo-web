import api from "../../../lib/axios"

export interface TelaInicialDto {
    proximoEvento: {
        id: string
        titulo: string
        nomeGrupo: string
        dataInicio: string
        localizacao: string | null
        fotoCapaUrl: string | null
        diasRestantes: string
        minhaConfirmacao: number | null
    } | null
    contadores: {
        eventosFuturos: number
        avisosNaoLidos: number
    }
    grupos: {
        id: string
        nome: string
        fotoUrl: string | null
    }[]
    atividadesRecentes: {
        id: string
        conteudo: string
        linkUrl: string | null
        dataEnvio: string
    }[]
}

export async function buscarTelaInicial(): Promise<TelaInicialDto> {
    const { data } = await api.get("/api/Home")
    return data.dados
}