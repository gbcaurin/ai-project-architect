from sqlalchemy import String, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base
import uuid

class PromptPipeline(Base):
    __tablename__ = "prompt_pipelines"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    target_ai: Mapped[str] = mapped_column(String, nullable=False)
    prompts: Mapped[list] = mapped_column(JSON, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    project: Mapped["Project"] = relationship("Project", back_populates="prompt_pipelines")