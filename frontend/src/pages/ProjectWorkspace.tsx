import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { projectsApi } from "../api/projects";
import { generationApi } from "../api/generation";
import { InterviewPanel } from "../components/interview/InterviewPanel";
import { ResultsPanel } from "../components/results/ResultsPanel";
import { AITool } from "../types";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    setMessages,
    setInterviewComplete,
    setPhase,
    setBlueprint,
    setPrompts,
    setAnalysis,
    setGenerating,
    reset,
  } = useProjectStore();

  const loadExistingOutputs = useCallback(async (projectId: string) => {
    // Carrega blueprint
    try {
      const { data } = await generationApi.getBlueprint(projectId);
      setBlueprint(data);
    } catch {}

    // Carrega analysis
    try {
      const { data } = await generationApi.getAnalysis(projectId);
      setAnalysis(data);
    } catch {}

    // Carrega prompts para todos os AI tools
    for (const ai of ["claude", "cursor", "lovable", "gpt"] as AITool[]) {
      try {
        const { data } = await generationApi.getPrompts(projectId, ai);
        setPrompts(ai, data);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    reset();

    projectsApi
      .get(id)
      .then(({ data }) => {
        if (data.messages?.length > 0) {
          setMessages(data.messages);
        }
        setPhase(data.interview_phase);
        if (data.status === "complete") {
          setInterviewComplete(true);
          loadExistingOutputs(id);
        }
      })
      .catch(() => navigate("/app"));

    return () => reset();
  }, [id]);

  // Quando entrevista completa pela primeira vez, gera tudo
  const handleInterviewComplete = useCallback(async (projectId: string) => {
    setGenerating(true);
    try {
      await Promise.allSettled([
        generationApi.createBlueprint(projectId),
        generationApi.createAnalysis(projectId),
      ]);
      await loadExistingOutputs(projectId);
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleGenerateBlueprint = useCallback(async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const { data } = await generationApi.createBlueprint(id);
      setBlueprint(data);
    } finally {
      setGenerating(false);
    }
  }, [id]);

  const handleGeneratePrompts = useCallback(
    async (ai: AITool) => {
      if (!id) return;
      setGenerating(true);
      try {
        const { data } = await generationApi.createPrompts(id, ai);
        setPrompts(ai, data);
      } finally {
        setGenerating(false);
      }
    },
    [id],
  );

  const handleGenerateAnalysis = useCallback(async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const { data } = await generationApi.createAnalysis(id);
      setAnalysis(data);
    } finally {
      setGenerating(false);
    }
  }, [id]);

  if (!id) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => navigate("/app")}
          className="text-gray-600 hover:text-gray-400 transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold text-white">
            Arquiteto de Projetos IA
          </span>
        </div>
        <span className="text-xs text-gray-700 ml-auto hidden md:block">
          {user?.email}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 border-r border-white/5 flex flex-col overflow-hidden">
          <InterviewPanel
            projectId={id}
            onInterviewComplete={() => handleInterviewComplete(id)}
          />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col bg-[#0c0c16]">
          <ResultsPanel
            projectId={id}
            onGenerateBlueprint={handleGenerateBlueprint}
            onGeneratePrompts={handleGeneratePrompts}
            onGenerateAnalysis={handleGenerateAnalysis}
          />
        </div>
      </div>
    </div>
  );
}
