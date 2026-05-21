import axios, { type AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function traduzirErro(error: AxiosError, isLogin?: boolean): string {
  if (!error.response) return "Sem conexão com o servidor. Verifique sua internet."
  switch (error.response.status) {
    case 400: return "Dados inválidos. Verifique as informações."
    case 401: return isLogin ? "E-mail ou senha incorretos." : "Sessão expirada. Faça login novamente."
    case 403: return "Você não tem permissão para esta ação."
    case 404: return "Recurso não encontrado."
    case 422: return "Dados inválidos. Verifique as informações."
    default:
      if (error.response.status >= 500) return "Erro no servidor. Tente novamente mais tarde."
      return "Ocorreu um erro inesperado."
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLogin = error.config?.url?.includes('Autenticacao/Login')
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(traduzirErro(error, isLogin)))
  }
)

export default api
