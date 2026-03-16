from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="interviewing")
    interview_phase: Mapped[str] = mapped_column(String, default="initial")
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    user: Mapped["User"] = relationship("User", back_populates="projects")
    messages: Mapped[list] = relationship("Message", back_populates="project", cascade="all, delete")
    project_data: Mapped[list] = relationship("ProjectData", back_populates="project", cascade="all, delete")
    blueprints: Mapped[list] = relationship("Blueprint", back_populates="project", cascade="all, delete")
    prompt_pipelines: Mapped[list] = relationship("PromptPipeline", back_populates="project", cascade="all, delete")
    analyses: Mapped[list] = relationship("Analysis", back_populates="project", cascade="all, delete")