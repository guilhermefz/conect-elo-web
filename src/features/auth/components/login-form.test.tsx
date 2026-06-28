import { render, screen } from '@testing-library/react'
import { LoginForm } from './login-form'
import { useLogin } from '../hooks/use-login'

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

  it('renderiza os campos de e-mail, senha e o botão Entrar', () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o login falha', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn() as ReturnType<typeof useLogin>['login'],
      isLoading: false,
      erro: 'Credenciais inválidas.',
    })

    render(<LoginForm />)

    expect(screen.getByText('Credenciais inválidas.')).toBeInTheDocument()
  })

  it('desabilita o botão e exibe "Entrando..." durante o carregamento', () => {
    vi.mocked(useLogin).mockReturnValue({
      login: vi.fn() as ReturnType<typeof useLogin>['login'],
      isLoading: true,
      erro: null,
    })

    render(<LoginForm />)

    const botao = screen.getByRole('button', { name: 'Entrando...' })
    expect(botao).toBeDisabled()
  })
})
