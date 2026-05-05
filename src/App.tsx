import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/login-page";
import { FeedPage } from "./features/feed/pages/feed-page";
import { GruposPage } from "./features/grupo/pages/grupos-page";
import { NovoGrupoPage } from "./features/grupo/pages/novo-grupo-page";
import { ChatPage } from "./features/chat/pages/chat-page";
import { AvisosPage } from "./features/avisos/pages/avisos-page";
import { PerfilPage } from "./features/perfil/pages/perfil-page";
import { EditarPerfilPage } from "./features/perfil/pages/editar-perfil-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/feed" element={<FeedPage />} />
        <Route path="/grupos" element={<GruposPage />} />
        <Route path="/grupos/novo" element={<NovoGrupoPage />} />
        <Route path="/grupos/:id/chat" element={<ChatPage />} />
        <Route path="/avisos" element={<AvisosPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/perfil/editar" element={<EditarPerfilPage />} />

      </Routes>
    </BrowserRouter>
  );
}
