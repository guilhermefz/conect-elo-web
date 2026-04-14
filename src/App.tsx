import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/login-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona a raiz (/) para o login enquanto não temos o feed */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota da nossa página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* As próximas rotas (Feed, Grupos, Eventos) 
          serão adicionadas aqui conforme fores criando 
        */}
      </Routes>
    </BrowserRouter>
  );
}
