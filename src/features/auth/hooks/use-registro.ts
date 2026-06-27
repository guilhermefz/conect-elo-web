import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-service";
import { useToast } from "../../../components/toast";

interface RegistroForm {
  nome: string;
  email: string;
  password: string;
  confirmarSenha: string;
  dataNascimento: string;
  genero: number;
}

interface ErrosForm {
  nome?: string;
  email?: string;
  password?: string;
  confirmarSenha?: string;
  dataNascimento?: string;
}

const SENHA_FORTE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;

function validar(dados: RegistroForm): ErrosForm {
  const erros: ErrosForm = {};

  if (!dados.nome.trim()) {
    erros.nome = "Nome é obrigatório.";
  } else if (dados.nome.trim().length < 3) {
    erros.nome = "Nome deve ter no mínimo 3 caracteres.";
  }

  if (!dados.email) {
    erros.email = "E-mail é obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    erros.email = "E-mail inválido.";
  }

  if (!dados.dataNascimento) {
    erros.dataNascimento = "Data de nascimento é obrigatória.";
  } else if (new Date(dados.dataNascimento) >= new Date()) {
    erros.dataNascimento = "Data de nascimento não pode ser no futuro.";
  }

  if (!dados.password) {
    erros.password = "Senha é obrigatória.";
  } else if (!SENHA_FORTE.test(dados.password)) {
    erros.password = "Senha deve conter maiúscula, minúscula, número e caractere especial.";
  }

  if (!dados.confirmarSenha) {
    erros.confirmarSenha = "Confirmação de senha é obrigatória.";
  } else if (dados.password !== dados.confirmarSenha) {
    erros.confirmarSenha = "As senhas não coincidem.";
  }

  return erros;
}

export function useRegistro() {
  const [isLoading, setIsLoading] = useState(false);
  const [erros, setErros] = useState<ErrosForm>({});
  const navigate = useNavigate();
  const { sucesso, erro: toastErro } = useToast();

  const registro = async (dados: RegistroForm) => {
    const errosValidacao = validar(dados);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setIsLoading(true);
    setErros({});
    try {
      await authService.registro({
        nome: dados.nome.trim(),
        email: dados.email,
        password: dados.password,
        dataNascimento: dados.dataNascimento,
        genero: dados.genero,
        cpf: null,
        bio: null,
      });
      sucesso("Conta criada com sucesso! Faça o login para continuar.");
      navigate("/login");
    } catch (err) {
      toastErro(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return { registro, isLoading, erros };
}
