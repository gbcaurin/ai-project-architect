from sqlalchemy import String, DateTime, ForeignKey, Text, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base
import uuid

class ProjectData(Base):
    __tablename__ = "project_data"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    idea_summary: Mapped[str] = mapped_column(Text, nullable=True)
    platform: Mapped[str] = mapped_column(String, nullable=True)
    target_users: Mapped[str] = mapped_column(Text, nullable=True)
    core_features: Mapped[dict] = mapped_column(JSON, nullable=True)
    tech_preferences: Mapped[dict] = mapped_column(JSON, nullable=True)
    constraints: Mapped[str] = mapped_column(Text, nullable=True)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    project: Mapped["Project"] = relationship("Project", back_populates="project_data")