from ai.llm_factory import get_llm

INTERVIEW_SYSTEM = """Você é um arquiteto de software sênior conduzindo uma entrevista estruturada para entender a ideia de projeto de software de um usuário. Seu objetivo é extrair informações suficientes para gerar um blueprint técnico completo.

Dados já coletados: {extracted_data}
Fase atual: {phase}

REGRAS:
1. Faça APENAS UMA pergunta por vez — direta e específica
2. Se a resposta for vaga (ex: "algo simples", "não sei"), detecte isso e faça uma pergunta mais específica
3. Seja conversacional e encorajador
4. Quando tiver informação suficiente sobre todos os aspectos principais, finalize com: [INTERVIEW_COMPLETE]

GUIA POR FASE:
- initial: Entenda a ideia central e plataforma alvo
- features: Explore cada feature em profundidade
- technical: Stack preferida, constraints, timeline
- confirm: Resumir e confirmar

Responda em português."""

async def run_interview_chain(messages: list, extracted_data: dict, phase: str):
    """Generator that streams interview response tokens."""
    llm = get_llm(streaming=True, temperature=0.7)

    try:
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
        lc_messages = [
            SystemMessage(content=INTERVIEW_SYSTEM.format(
                extracted_data=str(extracted_data) if extracted_data else "nenhum dado coletado ainda",
                phase=phase
            ))
        ]
        for msg in messages:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            else:
                lc_messages.append(AIMessage(content=msg["content"]))

        async for chunk in llm.astream(lc_messages):
            token = chunk.content if hasattr(chunk, "content") else str(chunk)
            yield token

    except Exception:
        # Fallback: use ainvoke with message list
        try:
            from langchain_core.messages import HumanMessage, SystemMessage
            fallback_messages = [
                SystemMessage(content=INTERVIEW_SYSTEM.format(
                    extracted_data=str(extracted_data) if extracted_data else "nenhum dado coletado ainda",
                    phase=phase
                ))
            ]
            if messages:
                fallback_messages.append(HumanMessage(content=messages[-1]["content"]))
            result = await llm.ainvoke(fallback_messages)
            content = result.content if hasattr(result, "content") else str(result)
            for word in content.split(" "):
                yield word + " "
        except Exception:
            yield "Desculpe, ocorreu um erro. Pode reformular sua resposta?"
