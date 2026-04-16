import  api  from "../../../lib/axios";

export const authService = {
    login: async (credentials: any) => {
        const { data } = await api.post("/api/Autenticacao/Login", credentials);
        return data;
    }
}