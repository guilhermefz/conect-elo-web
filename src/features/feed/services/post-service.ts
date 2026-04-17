import  api  from "../../../lib/axios";

export const postService = {
    criar: async (conteudo: string) => {
        const token = localStorage.getItem("token");

        const response = await api.post("/api/Postagem/Salvar",
            { conteudo ,
              muralId: "c3e99bcb-8222-41f8-89d5-4201087044ed"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    }
}