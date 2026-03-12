from pydantic import BaseModel
from typing import Optional, Any


class BlueprintResponse(BaseModel):
    id: str
    content: str
    created_at: Any

    class Config:
        from_attributes = True


class PromptItem(BaseModel):
    step: int
    title: str
    prompt: str


class PromptPipelineResponse(BaseModel):
    id: str
    target_ai: str
    prompts: list[PromptItem]
    created_at: Any

    class Config:
        from_attributes = True


class GeneratePromptsRequest(BaseModel):
    target_ai: str  # claude | cursor | lovable | gpt


class AnalysisResponse(BaseModel):
    id: str
    complexity: Optional[str]
    dev_time_days: Optional[int]
    team_size: Optional[int]
    complexity_factors: Optional[list]
    similar_products: Optional[list]
    monetization_models: Optional[list]
    suggested_improvements: Optional[list]
    created_at: Any

    class Config:
        from_attributes = True
