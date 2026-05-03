import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/login-page";
import { FeedPage } from "./features/feed/pages/feed-page";
import { GruposPage } from "./features/grupo/pages/grupos-page";
import { NovoGrupoPage } from "./features/grupo/pages/novo-grupo-page";
import { ChatPage } from "./features/chat/pages/chat-page";

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

      </Routes>
    </BrowserRouter>
  );
}
