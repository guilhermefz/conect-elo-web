import { render, screen } from '@testing-library/react'
import { PostCard } from './post-card'
import type { FeedPostagemDto } from '../services/post-service'

const postMock: FeedPostagemDto = {
  id: '1',
  conteudo: 'Bem-vindos ao ConecteElo!',
  dataPostagem: '2024-06-28T10:00:00Z',
  usuarioId: 'u1',
  nomeAutor: 'João Silva',
  muralId: 'm1',
  grupoId: 'g1',
  nomeGrupo: 'Turma A',
  fotoPerfilUrl: null,
}

describe('PostCard', () => {
  it('renderiza nome do autor, grupo e conteúdo do post', () => {
    render(<PostCard post={postMock} />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Turma A')).toBeInTheDocument()
    expect(screen.getByText('Bem-vindos ao ConecteElo!')).toBeInTheDocument()
  })

  it('exibe emoji 🤝 quando o autor não tem foto de perfil', () => {
    render(<PostCard post={postMock} />)

    expect(screen.getByText('🤝')).toBeInTheDocument()
  })
})
