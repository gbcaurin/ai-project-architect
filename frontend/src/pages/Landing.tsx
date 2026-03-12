import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">AI Project Architect</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(isAuthenticated() ? '/app' : '/login')}
            className="text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors"
          >
            {isAuthenticated() ? 'Dashboard' : 'Sign in'}
          </button>
          <button
            onClick={() => navigate(isAuthenticated() ? '/app' : '/register')}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isAuthenticated() ? 'Open app' : 'Get started'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20 pb-32">
        <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
          Turn your idea into AI-ready blueprints
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
          Your AI software
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> architect</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
          Stop struggling with vague prompts. Our AI interviews you about your idea
          and generates a complete technical blueprint — optimized for Claude Code,
          Cursor, Lovable, and GPT.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-7 py-3.5 rounded-xl transition-all hover:scale-105 text-sm"
          >
            Start building for free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium px-7 py-3.5 rounded-xl transition-all text-sm"
          >
            Sign in
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-16 max-w-2xl">
          {[
            '🎯 Adaptive AI interview',
            '🏗️ Full architecture blueprint',
            '🔀 Step-by-step prompt pipeline',
            '⚡ Multi-AI optimization',
            '📊 Complexity analysis',
            '💡 Market insights',
          ].map(f => (
            <span key={f} className="text-xs text-gray-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </main>
    </div>
  )
}
