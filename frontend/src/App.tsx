import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { authApi } from "./api/auth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    //Valida o token e recarrega o user
    authApi
      .me()
      .then(({ data }) => setAuth({ id: data.id, email: data.email }, token))
      .catch(() => logout()); //Token expirado ou inválido → desloga
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Projects />
            </RequireAuth>
          }
        />
        <Route
          path="/app/project/:id"
          element={
            <RequireAuth>
              <ProjectWorkspace />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
