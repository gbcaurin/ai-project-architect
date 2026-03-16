from sqlalchemy import String, DateTime, ForeignKey, Integer, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base
import uuid

class Analysis(Base):
    __tablename__ = "analyses"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    complexity: Mapped[str] = mapped_column(String, nullable=True)
    dev_time_days: Mapped[int] = mapped_column(Integer, nullable=True)
    team_size: Mapped[int] = mapped_column(Integer, nullable=True)
    complexity_factors: Mapped[list] = mapped_column(JSON, nullable=True)
    similar_products: Mapped[list] = mapped_column(JSON, nullable=True)
    monetization_models: Mapped[list] = mapped_column(JSON, nullable=True)
    suggested_improvements: Mapped[list] = mapped_column(JSON, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    project: Mapped["Project"] = relationship("Project", back_populates="analyses")