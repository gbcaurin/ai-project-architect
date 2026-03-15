import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api/projects";
import { useAuthStore } from "../store/authStore";
import { Project } from "../types";
import { Plus, Trash2, ArrowRight, LogOut } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    projectsApi.list().then((r) => {
      setProjects(r.data);
      setLoading(false);
    });
  }, []);

  const createProject = async () => {
    setCreating(true);
    const { data } = await projectsApi.create();
    navigate(`/app/project/${data.id}`);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir este projeto?")) return;
    await projectsApi.delete(id);
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top bar */}
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-semibold text-sm">
            Arquiteto de Projetos IA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">{user?.email}</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-gray-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Seus projetos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Transforme suas ideias em blueprints detalhados
            </p>
          </div>
          <button
            onClick={createProject}
            disabled={creating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            Novo projeto
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/3 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-400 font-medium mb-2">
              Nenhum projeto ainda
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Inicie sua primeira entrevista com IA para criar um blueprint de
              software
            </p>
            <button
              onClick={createProject}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Iniciar um novo projeto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/app/project/${p.id}`)}
                className="group flex items-center justify-between bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/15 rounded-xl px-5 py-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${p.status === "complete" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {p.title || "Projeto sem título"}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {p.status === "complete"
                        ? "Blueprint pronto"
                        : `Entrevista em andamento · ${p.interview_phase}`}
                      {" · "}
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => deleteProject(p.id, e)}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ArrowRight size={14} className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
