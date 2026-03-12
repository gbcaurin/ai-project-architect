from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProjectCreate(BaseModel):
    title: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    title: Optional[str]
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


class ProjectDetailResponse(BaseModel):
    id: str
    title: Optional[str]
    status: str
    interview_phase: str
    messages: list[MessageResponse]
    created_at: datetime

    class Config:
        from_attributes = True
