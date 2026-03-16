from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Literal
from datetime import datetime

class RegisterRequest(BaseModel):
    email: EmailStr  
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

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
    title: Optional[str] = None  
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
    target_ai: Literal["claude", "cursor", "lovable", "gpt"] = "claude"
