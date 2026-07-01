export type AbaChatAnonimo = "recebido" | "enviado";

export interface MensagemAnonima {
  id: string;
  conteudo: string;
  /** true = eu enviei (bolha verde à direita); false = recebida (à esquerda) */
  enviada: boolean;
  /** texto já formatado exibido na bolha, ex: "ontem 19:40" */
  horario: string;
}

export interface ConversaAnonima {
  id: string;
  titulo: string;
  emoji: string;
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  mensagens: Record<AbaChatAnonimo, MensagemAnonima[]>;
}

export const conversasAnonimas: ConversaAnonima[] = [
  {
    id: "amigo-secreto-galera",
    titulo: "Amigo Secreto da Galera",
    emoji: "🎁",
    ultimaMensagem: "Adoro tons de azul e verde!",
    horario: "10:07",
    naoLidas: 1,
    mensagens: {
      recebido: [
        { id: "r1", conteudo: "Oi! Eu que te tirei no amigo secreto 🎁", enviada: false, horario: "ontem 19:40" },
        { id: "r2", conteudo: "Aee! Dá uma olhada na minha lista de desejos 😍", enviada: true, horario: "ontem 19:52" },
        { id: "r3", conteudo: "Já tô preparando algo especial 😜", enviada: false, horario: "ontem 20:01" },
      ],
      enviado: [
        { id: "e1", conteudo: "Oi! Me conta 3 coisas que você adora 🎁", enviada: true, horario: "ontem 18:30" },
        { id: "e2", conteudo: "Adoro tons de azul e verde!", enviada: false, horario: "ontem 18:45" },
      ],
    },
  },
];

export function obterConversaAnonima(id: string): ConversaAnonima | null {
  return conversasAnonimas.find((c) => c.id === id) ?? null;
}
