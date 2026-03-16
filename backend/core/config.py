from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Project Architect"
    DEBUG: bool = False
    PORT: int = 8000

    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"

    GROQ_API_KEY: str = ""

    SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7

    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()