# Documentação de Testes — ConecteElo Frontend

## Sumário

1. [Por que testar o frontend?](#1-por-que-testar-o-frontend)
2. [Stack de testes utilizada](#2-stack-de-testes-utilizada)
3. [Configuração da infraestrutura](#3-configuração-da-infraestrutura)
4. [Anatomia de um teste](#4-anatomia-de-um-teste)
5. [Conceitos fundamentais do RTL](#5-conceitos-fundamentais-do-rtl)
6. [O que é mock e por que usar](#6-o-que-é-mock-e-por-que-usar)
7. [Arquivo: post-card.test.tsx](#7-arquivo-post-cardtesttsx)
8. [Arquivo: login-form.test.tsx](#8-arquivo-login-formtesttsx)
9. [Como executar os testes](#9-como-executar-os-testes)
10. [Guia rápido de leitura dos resultados](#10-guia-rápido-de-leitura-dos-resultados)

---

## 1. Por que testar o frontend?

Testes automatizados respondem à pergunta: **"o que eu escrevi faz o que deveria fazer?"** de forma repetível e sem depender de um humano clicar em tudo manualmente.

No contexto do ConecteElo, os testes garantem que:

- O formulário de login exibe os campos corretos e responde ao estado da aplicação.
- O card de postagem do feed renderiza os dados do usuário sem erros.
- Quando ocorre um erro de login, a mensagem chega na tela do usuário.
- Quando a requisição está em andamento, o botão fica desabilitado para evitar cliques duplicados.

Esses são comportamentos críticos para a experiência do usuário. Se alguém alterar o código e quebrar um desses comportamentos, o teste vai falhar imediatamente — antes de chegar na apresentação ou em produção.

---

## 2. Stack de testes utilizada

| Ferramenta | Papel |
|---|---|
| **Vitest** | Runner de testes — executa os arquivos `.test.tsx`, controla o ambiente, exibe os resultados |
| **React Testing Library (RTL)** | Renderiza componentes React no ambiente de teste e fornece ferramentas para buscar elementos na tela |
| **jest-dom** | Extensão do RTL que adiciona matchers como `toBeInTheDocument()` e `toBeDisabled()` |
| **jsdom** | Simula o DOM (Document Object Model) do browser dentro do Node.js, sem precisar abrir um browser real |

### Por que Vitest e não Jest?

O Vitest foi desenvolvido pelos mesmos criadores do Vite e usa a mesma configuração e o mesmo sistema de módulos do projeto. Isso significa zero conflito de configuração — o Vitest entende TypeScript, path aliases e variáveis de ambiente (`import.meta.env`) nativamente.

### Por que React Testing Library e não Enzyme?

O RTL testa componentes pela **perspectiva do usuário**: ele busca elementos pelo texto visível, pelo placeholder, pelo papel semântico (button, input) — da mesma forma que um usuário real os enxerga. Isso torna os testes mais confiáveis e menos frágeis a refatorações internas.

---

## 3. Configuração da infraestrutura

### 3.1 — `vite.config.ts`

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
// ...

export default defineConfig({
  // ... plugins existentes ...
  test: {
    environment: 'jsdom',     // (1)
    globals: true,            // (2)
    setupFiles: ['./src/test/setup.ts'], // (3)
  },
})
```

**(1) `environment: 'jsdom'`**
Por padrão, o Vitest roda em Node.js puro, que não tem `document`, `window` ou `localStorage`. O jsdom cria uma implementação dessas APIs em memória, permitindo que componentes React sejam renderizados como se estivessem num browser.

**(2) `globals: true`**
Com esta opção, as funções `describe`, `it`, `expect` e `vi` ficam disponíveis em todos os arquivos de teste sem precisar importá-las. Isso é uma conveniência de escrita — o Vitest injeta esses nomes globalmente.

**(3) `setupFiles`**
Lista de arquivos que rodam **antes de cada arquivo de teste**. Usamos para configurar os matchers customizados do jest-dom (ver seção 3.2).

A linha `/// <reference types="vitest" />` é uma diretiva TypeScript que informa ao compilador que o bloco `test` é válido dentro do `defineConfig` do Vite.

---

### 3.2 — `src/test/setup.ts`

```ts
import '@testing-library/jest-dom'
```

Uma linha só. Essa importação registra no ambiente de teste todos os matchers adicionais do jest-dom:

- `toBeInTheDocument()` — verifica se o elemento existe no DOM
- `toBeDisabled()` — verifica se o elemento está com `disabled`
- `toHaveAttribute(attr, value)` — verifica atributos HTML
- Entre outros 20+ matchers úteis

---

### 3.3 — `tsconfig.app.json`

```json
"types": ["vite/client", "vitest/globals"]
```

A adição de `"vitest/globals"` informa ao TypeScript que `describe`, `it`, `expect` e `vi` existem no escopo global, removendo os erros de "variável não declarada" que apareceriam no modo strict.

---

### 3.4 — `package.json`

```json
"test": "vitest run",
"test:watch": "vitest"
```

- `npm test` — executa todos os testes uma vez e encerra. Ideal para CI e para rodar antes de uma apresentação.
- `npm run test:watch` — fica assistindo mudanças nos arquivos e re-executa os testes automaticamente. Ideal durante o desenvolvimento.

---

## 4. Anatomia de um teste

Todo teste segue o padrão **AAA (Arrange → Act → Assert)**:

```
Arrange  →  preparar os dados e o ambiente
Act      →  executar a ação que está sendo testada
Assert   →  verificar que o resultado é o esperado
```

No contexto do RTL, o padrão se traduz para:

```
Arrange  →  criar os dados mock e configurar os mocks
Act      →  chamar render(<Componente />)
Assert   →  usar expect(screen.get...).to...()
```

Exemplo concreto do projeto:

```tsx
it('renderiza nome do autor, grupo e conteúdo do post', () => {
  // ARRANGE — dados de entrada preparados
  // (postMock é definido fora do teste, reutilizável)

  // ACT — renderiza o componente no DOM simulado
  render(<PostCard post={postMock} />)

  // ASSERT — verifica o que o usuário veria na tela
  expect(screen.getByText('João Silva')).toBeInTheDocument()
  expect(screen.getByText('Turma A')).toBeInTheDocument()
  expect(screen.getByText('Bem-vindos ao ConecteElo!')).toBeInTheDocument()
})
```

---

## 5. Conceitos fundamentais do RTL

### `render()`

```tsx
render(<PostCard post={postMock} />)
```

Monta o componente num nó DOM virtual criado pelo jsdom. Após essa linha, todos os elementos HTML que o componente gera estão disponíveis para consulta via `screen`.

---

### `screen`

O objeto `screen` representa a tela atual — tudo que foi renderizado. Ele oferece métodos de busca que imitam como um usuário encontra elementos:

| Método | Critério de busca | Quando usar |
|---|---|---|
| `getByText('texto')` | Texto visível | Parágrafo, título, label |
| `getByRole('button', { name: 'Entrar' })` | Papel semântico HTML + nome acessível | Botões, links, inputs |
| `getByPlaceholderText('seu@email.com')` | Atributo `placeholder` do input | Campos de formulário |

> **Regra de ouro do RTL:** prefira buscar pelo que o usuário vê, não pelo que o desenvolvedor escreveu. Nunca busque por `className`, `id` ou estrutura interna do componente — isso tornaria os testes frágeis.

---

### `expect()` e matchers

```ts
expect(screen.getByText('João Silva')).toBeInTheDocument()
//     ^                               ^
//     elemento encontrado             verificação aplicada
```

O `expect()` recebe qualquer valor e os matchers (`.toBeInTheDocument()`, `.toBeDisabled()`, etc.) definem a condição que deve ser verdadeira para o teste passar.

---

### `describe()` e `it()`

```ts
describe('PostCard', () => {        // agrupa testes relacionados
  it('renderiza nome do autor', () => {  // um caso de teste
    // ...
  })
})
```

`describe` é um agrupador opcional — organiza testes sobre o mesmo componente. `it` (ou `test`, são sinônimos) define um caso de teste individual. O nome dado ao `it` é o que aparece no relatório de resultado.

---

## 6. O que é mock e por que usar

Um **mock** é uma substituição controlada de uma dependência real. No lugar de chamar o código original, o mock responde com dados pré-definidos.

### Por que mockar o `useLogin`?

O componente `LoginForm` usa o hook `useLogin`, que por sua vez faz uma requisição HTTP real para o backend. Em testes de componente, **não queremos depender de uma API externa** por três motivos:

1. **Velocidade** — requisições de rede tornam os testes lentos.
2. **Isolamento** — o teste do `LoginForm` deve verificar o comportamento *do formulário*, não do servidor.
3. **Controle** — como simular um erro de credenciais inválidas sem ter uma conta inválida cadastrada?

Com o mock, controlamos exatamente o que o hook retorna em cada cenário:

```ts
// Cenário 1: estado normal
vi.mocked(useLogin).mockReturnValue({
  login: vi.fn(),
  isLoading: false,
  erro: null,
})

// Cenário 2: login falhou
vi.mocked(useLogin).mockReturnValue({
  login: vi.fn(),
  isLoading: false,
  erro: 'Credenciais inválidas.',
})

// Cenário 3: requisição em andamento
vi.mocked(useLogin).mockReturnValue({
  login: vi.fn(),
  isLoading: true,
  erro: null,
})
```

---

### Como o mock funciona no código

```ts
vi.mock('../hooks/use-login')
```

Esta linha instrui o Vitest a interceptar qualquer importação do módulo `use-login` dentro deste arquivo de teste. Em vez do módulo real, ele retorna uma versão controlada — o mock. O `vi.mock` é processado pelo Vitest antes mesmo da execução do arquivo, garantindo que nenhum código real do hook rode.

```ts
vi.mocked(useLogin)
```

Converte a referência ao `useLogin` importado para um tipo mockado do TypeScript, habilitando os métodos `.mockReturnValue()`, `.mockResolvedValue()` etc.

---

### `beforeEach` e `afterEach`

```ts
beforeEach(() => {
  // roda antes de cada it()
  vi.mocked(useLogin).mockReturnValue({ login: vi.fn(), isLoading: false, erro: null })
})

afterEach(() => {
  // roda depois de cada it()
  vi.clearAllMocks()
})
```

`beforeEach` garante que cada teste começa com um estado padrão conhecido. `afterEach` com `vi.clearAllMocks()` limpa o histórico de chamadas dos mocks para que um teste não interfira no próximo.

---

## 7. Arquivo: post-card.test.tsx

O `PostCard` é um componente de **exibição pura** — recebe dados via props e renderiza HTML. Não faz requisições, não tem estado interno significativo, não depende de rotas. Por isso seus testes são os mais simples: não precisam de nenhum mock.

### Dados de teste (mock de dados)

```ts
const postMock: FeedPostagemDto = {
  id: '1',
  conteudo: 'Bem-vindos ao ConecteElo!',
  dataPostagem: '2024-06-28T10:00:00Z',
  usuarioId: 'u1',
  nomeAutor: 'João Silva',
  muralId: 'm1',
  grupoId: 'g1',
  nomeGrupo: 'Turma A',
  fotoPerfilUrl: null,   // ← null simula usuário sem foto
}
```

O tipo `FeedPostagemDto` é importado do próprio serviço do projeto — isso garante que se a interface mudar, o teste de compilação vai quebrar e nos avisar.

---

### Teste 1 — Renderiza os dados principais

```tsx
it('renderiza nome do autor, grupo e conteúdo do post', () => {
  render(<PostCard post={postMock} />)

  expect(screen.getByText('João Silva')).toBeInTheDocument()
  expect(screen.getByText('Turma A')).toBeInTheDocument()
  expect(screen.getByText('Bem-vindos ao ConecteElo!')).toBeInTheDocument()
})
```

**O que está sendo testado:** se os três campos mais importantes de uma postagem chegam visíveis ao usuário — o autor, o grupo e o texto da postagem.

**Por que é importante:** o `PostCard` recebe um objeto `post` e renderiza vários campos. Se alguém alterar a prop errada (ex: exibir `post.id` no lugar de `post.nomeAutor`), esse teste vai pegar o erro.

---

### Teste 2 — Fallback sem foto de perfil

```tsx
it('exibe emoji 🤝 quando o autor não tem foto de perfil', () => {
  render(<PostCard post={postMock} />)  // fotoPerfilUrl: null

  expect(screen.getByText('🤝')).toBeInTheDocument()
})
```

**O que está sendo testado:** o comportamento de fallback quando `fotoPerfilUrl` é `null`. No componente real, quando não há foto, é exibido o emoji `🤝` no lugar da imagem.

**Por que é importante:** interfaces que exibem conteúdo gerado por usuários precisam ter fallbacks para dados ausentes. Testar esse caso garante que nenhum usuário vai ver um espaço vazio ou quebrado.

---

## 8. Arquivo: login-form.test.tsx

O `LoginForm` é mais complexo que o `PostCard` porque tem **comportamento** — ele reage a estados externos (loading, erro) vindos do hook `useLogin`. Por isso precisamos de mock.

### Configuração compartilhada

```ts
vi.mock('../hooks/use-login')

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn() as ReturnType<typeof useLogin>['login'],
      isLoading: false,
      erro: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
```

O `beforeEach` estabelece o estado padrão: nenhum erro, não está carregando. Cada teste pode sobrescrever esse valor se precisar de um cenário diferente.

---

### Teste 3 — Renderiza o formulário completo

```tsx
it('renderiza os campos de e-mail, senha e o botão Entrar', () => {
  render(<LoginForm />)

  expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
})
```

**O que está sendo testado:** a presença dos elementos básicos que compõem o formulário.

**Por que `getByRole('button', { name: 'Entrar' })`?**
`getByRole` é a forma preferida do RTL porque usa a semântica HTML. `role: 'button'` encontra elementos `<button>`. O `name: 'Entrar'` verifica o texto visível do botão — se o texto mudar para "Login", o teste vai falhar e avisar.

---

### Teste 4 — Exibe mensagem de erro

```tsx
it('exibe mensagem de erro quando o login falha', () => {
  vi.mocked(useLogin).mockReturnValue({
    login: vi.fn() as ReturnType<typeof useLogin>['login'],
    isLoading: false,
    erro: 'Credenciais inválidas.',   // ← sobrescreve o beforeEach
  })

  render(<LoginForm />)

  expect(screen.getByText('Credenciais inválidas.')).toBeInTheDocument()
})
```

**O que está sendo testado:** se a mensagem de erro chegou na tela do usuário. O componente real tem esse trecho:

```tsx
{erro && (
  <p className="text-red-400 text-sm text-center">{erro}</p>
)}
```

O teste verifica que esse `<p>` aparece no DOM quando `erro` não é `null`.

**Por que é importante:** erros silenciosos são um dos piores bugs de UX. O usuário digita a senha errada e não recebe feedback — ele fica tentando sem saber o que aconteceu.

---

### Teste 5 — Estado de carregamento

```tsx
it('desabilita o botão e exibe "Entrando..." durante o carregamento', () => {
  vi.mocked(useLogin).mockReturnValue({
    login: vi.fn() as ReturnType<typeof useLogin>['login'],
    isLoading: true,   // ← simula requisição em andamento
    erro: null,
  })

  render(<LoginForm />)

  const botao = screen.getByRole('button', { name: 'Entrando...' })
  expect(botao).toBeDisabled()
})
```

**O que está sendo testado:** dois comportamentos simultâneos quando `isLoading` é `true`:
1. O texto do botão muda de "Entrar" para "Entrando..."
2. O botão fica desabilitado (`disabled`)

**Por que ambos importam:**
- Mudar o texto dá feedback visual ao usuário de que algo está acontecendo.
- Desabilitar o botão evita que o usuário envie o formulário duas vezes enquanto a primeira requisição ainda não terminou (double-submit), o que poderia causar erros no backend.

---

## 9. Como executar os testes

```bash
# Executar todos os testes uma vez (resultado final)
npm test

# Modo assistido: re-executa ao salvar arquivos
npm run test:watch
```

Saída esperada ao rodar `npm test`:

```
 RUN  v4.x.x

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Duration  ~4s
```

---

## 10. Guia rápido de leitura dos resultados

### Tudo passando

```
✓ PostCard > renderiza nome do autor, grupo e conteúdo do post
✓ PostCard > exibe emoji 🤝 quando o autor não tem foto de perfil
✓ LoginForm > renderiza os campos de e-mail, senha e o botão Entrar
✓ LoginForm > exibe mensagem de erro quando o login falha
✓ LoginForm > desabilita o botão e exibe "Entrando..." durante o carregamento
```

### Quando um teste falha

```
× LoginForm > exibe mensagem de erro quando o login falha

AssertionError: expected element not to be in the document
  - Expected: "Credenciais inválidas." to be in the document
  + Received: element not found
```

A mensagem indica exatamente qual teste falhou, em qual arquivo, e qual era a expectativa versus o que foi encontrado. Com essa informação é possível ir direto ao componente e corrigir o problema.

---

## Resumo da lógica de escolha dos testes

Os 5 testes foram escolhidos por cobrirem os **fluxos críticos** da aplicação:

| # | Componente | Cenário | Motivo |
|---|---|---|---|
| 1 | PostCard | Dados aparecem na tela | Funcionalidade central do feed |
| 2 | PostCard | Fallback sem foto | Robustez com dados ausentes |
| 3 | LoginForm | Formulário renderiza completo | Porta de entrada da aplicação |
| 4 | LoginForm | Erro de login visível ao usuário | Feedback essencial de UX |
| 5 | LoginForm | Botão desabilitado no loading | Proteção contra double-submit |

A filosofia do React Testing Library pode ser resumida em uma frase do seu criador, Kent C. Dodds:

> *"Quanto mais seus testes se parecem com a forma como o software é usado, mais confiança eles te dão."*
