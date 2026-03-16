from core.config import settings


def get_llm(streaming: bool = False, temperature: float = 0.7):
    from langchain_groq import ChatGroq
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        streaming=streaming,
        temperature=temperature,
        groq_api_key=settings.GROQ_API_KEY
    )