# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Comandos

```bash
npm run dev        # Inicia o servidor de desenvolvimento (abre o navegador automaticamente)
npm run build      # Verifica tipos + build de produção
npm run preview    # Serve o build de produção localmente
npm run lint       # Executa o ESLint
```

## Arquitetura

**Stack:** React 19 + TypeScript 5 + Vite 8 + Tailwind CSS 4 + React Router 7 + Axios

**Estrutura por feature** — cada funcionalidade fica em `src/features/<nome>/` com seus próprios subdiretórios `pages/`, `components/`, `hooks/` e `services/`. Features atuais: `auth`, `feed`, `chat` (stub), `eventos` (stub), `grupos` (stub).

**Rotas** definidas em [src/App.tsx](src/App.tsx):
- `/` redireciona para `/login`
- `/login` → `LoginPage`
- `/feed` → `FeedPage`

**Cliente HTTP** — [src/lib/axios.ts](src/lib/axios.ts) exporta uma instância Axios pré-configurada:
- `baseURL` vem da variável de ambiente `VITE_API_URL` (padrão: `http://localhost:5000`)
- Interceptor de requisição: injeta `Authorization: Bearer <token>` do `localStorage`
- Interceptor de resposta: no 401, limpa o token e redireciona para `/login`

**Fluxo de autenticação:** `LoginForm` → hook `useLogin` → `authService.login()` → salva `accessToken` no `localStorage` → navega para `/feed`.

**Padrão de serviços:** arquivos de serviço exportam objetos simples com métodos async que chamam o Axios diretamente. Sem camada de abstração — strings de endpoint raw nos arquivos de serviço.

**Variável de ambiente:** `VITE_API_URL` define a URL base do backend. Crie `.env.local` para sobrescrever localmente.

## TypeScript

- Modo strict habilitado com `noUnusedLocals` e `noUnusedParameters` — variáveis não utilizadas são erros, não avisos.
- Alias `@/*` aponta para `src/*` — prefira isso em vez de imports relativos que sobem mais de um nível.
- Target ES2023, module ESNext.

## Estilização

Use classes utilitárias do Tailwind. `src/index.css` usa `@import "tailwindcss"` (sintaxe Tailwind v4). Evite estilos inline — existem alguns na página de feed, mas não devem ser adicionados em código novo.
