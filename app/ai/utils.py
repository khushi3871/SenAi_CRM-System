import os
from groq import Groq

# Load API key from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)


def get_llm_response(prompt: str) -> str:
    """
    Calls Groq LLM and returns raw response text
    Used by AI Agent
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI CRM agent. Always return strict JSON when asked."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        return response.choices[0].message.content

    except Exception as e:
        return f'{{"error": "LLM call failed", "details": "{str(e)}"}}'