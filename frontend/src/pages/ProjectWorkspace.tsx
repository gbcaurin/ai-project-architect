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
    interviewComplete,
    reset,
  } = useProjectStore();

  // Load project on mount
  useEffect(() => {
    if (!id) return;
    reset();

    projectsApi
      .get(id)
      .then(({ data }) => {
        if (data.messages?.length > 0) {
          setMessages(data.messages);
        }
        if (data.status === "complete") {
          setInterviewComplete(true);
          // Load existing outputs
          loadExistingOutputs(id);
        }
        setPhase(data.interview_phase);
      })
      .catch(() => navigate("/app"));

    return () => reset();
  }, [id]);

  // When interview completes, auto-generate all outputs
  useEffect(() => {
    if (interviewComplete && id) {
      generateAll(id);
    }
  }, [interviewComplete]);

  const loadExistingOutputs = async (projectId: string) => {
    try {
      const [bp, analysis] = await Promise.allSettled([
        generationApi.getBlueprint(projectId),
        generationApi.getAnalysis(projectId),
      ]);
      if (bp.status === "fulfilled") setBlueprint(bp.value.data);
      if (analysis.status === "fulfilled") setAnalysis(analysis.value.data);
    } catch {}
  };

  const generateAll = useCallback(async (projectId: string) => {
    setGenerating(true);
    try {
      const [bp] = await Promise.allSettled([
        generationApi.createBlueprint(projectId),
        generationApi.createAnalysis(projectId),
      ]);
      if (bp.status === "fulfilled") setBlueprint(bp.value.data);

      try {
        const { data: analysis } = await generationApi.getAnalysis(projectId);
        setAnalysis(analysis);
      } catch {}
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
      {/* Top bar */}
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
            AI Project Architect
          </span>
        </div>
        <span className="text-xs text-gray-700 ml-auto hidden md:block">
          {user?.email}
        </span>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Interview panel — left */}
        <div className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 border-r border-white/5 flex flex-col overflow-hidden">
          <InterviewPanel projectId={id} />
        </div>

        {/* Results panel — right */}
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
