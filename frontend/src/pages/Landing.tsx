import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            Curio Architect
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(isAuthenticated() ? "/app" : "/login")}
            className="text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors"
          >
            {isAuthenticated() ? "Painel" : "Entrar"}
          </button>
          <button
            onClick={() => navigate(isAuthenticated() ? "/app" : "/register")}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isAuthenticated() ? "Abrir app" : "Começar"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20 pb-32">
        <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
          Transforme sua ideia em blueprints prontos para IA
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
          Seu software com IA
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {" "}
            rápidamente
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
          Pare de lutar com prompts vagos. Nossa IA faz uma entrevista sobre sua
          ideia e gera um blueprint técnico completo — otimizado para Claude
          Code, Cursor, Lovable e GPT.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-sm"
          >
            Comece a construir grátis
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium px-7 py-3.5 rounded-xl transition-all text-sm"
          >
            Entrar
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-16 max-w-2xl">
          {[
            "Entrevista com IA adaptativa",
            "Blueprint de arquitetura completo",
            "Pipeline de prompts passo a passo",
            "Otimização multi-IA",
            "Análise de complexidade",
            "Insights de mercado",
          ].map((f) => (
            <span
              key={f}
              className="text-xs text-gray-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
