import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-service";
import { useToast } from "../../../components/toast";

interface RegistroForm {
  email: string;
  password: string;
  confirmarSenha: string;
}

interface ErrosForm {
  email?: string;
  password?: string;
  confirmarSenha?: string;
}

function validar(dados: RegistroForm): ErrosForm {
  const erros: ErrosForm = {};

  if (!dados.email) {
    erros.email = "E-mail é obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    erros.email = "E-mail inválido.";
  }

  if (!dados.password) {
    erros.password = "Senha é obrigatória.";
  } else if (dados.password.length < 6) {
    erros.password = "Senha deve ter no mínimo 6 caracteres.";
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
      await authService.registro({ email: dados.email, password: dados.password });
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
