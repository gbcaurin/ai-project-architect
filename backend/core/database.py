from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    from models import User, Project, Message, ProjectData, Blueprint, PromptPipeline, Analysis
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Alias for compatibility
create_tables = init_db
