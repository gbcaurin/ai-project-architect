from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user_id: str
    email: str

class ProjectCreate(BaseModel):
    title: Optional[str] = "Novo Projeto"

class ProjectResponse(BaseModel):
    id: str
    title: str
    status: str
    interview_phase: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ProjectWithMessages(ProjectResponse):
    messages: List[MessageResponse] = []

class GeneratePromptsRequest(BaseModel):
    target_ai: str = "claude"
