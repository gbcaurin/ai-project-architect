from core.config import settings


def get_llm(streaming: bool = False, temperature: float = 0.7):
    if settings.LLM_PROVIDER == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            streaming=streaming,
            temperature=temperature,
            google_api_key=settings.GOOGLE_API_KEY
        )
    else:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o-mini",
            streaming=streaming,
            temperature=temperature,
            openai_api_key=settings.OPENAI_API_KEY
        )
