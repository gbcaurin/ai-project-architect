import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.register(email, password);
      setAuth({ id: data.user_id, email: data.email }, data.token);
      navigate("/app");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Criar conta</h1>
          <p className="text-gray-500 text-sm mt-1">
            Comece a construir com IA
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="pelo menos 6 caracteres"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
