import os
import json
from dotenv import load_dotenv
import os


load_dotenv()

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


SYSTEM_PROMPT = """
You are a production-grade AI CRM Intelligence Engine.

Your job is to analyze email threads and return STRICT structured JSON.

RULES:
1. Output MUST be valid JSON only.
2. Do NOT include explanations, markdown, or text outside JSON.
3. If unsure, use null instead of guessing.
4. Always follow schema exactly.
5. Be consistent across similar inputs.
6. Use thread context for decision making.

CRITICAL BEHAVIOR:
- If email is spam → category must be "Spam"
- If legal threat → category must be "Legal"
- If security issue → urgency must be "Critical"
- If user shows anger + churn signals → requires_human = true

CONFIDENCE RULE:
- If information is incomplete → reduce confidence (<0.7)

You are part of a SaaS CRM system used for enterprise email intelligence.
"""

def build_prompt(email, thread_history=None, rag_context=None):
    return f"""
Analyze this email thread and classify it for CRM automation.

RAG CONTEXT:
{rag_context if rag_context else "No company policies found"}

THREAD CONTEXT:
{thread_history if thread_history else "No previous messages"}

CURRENT EMAIL:
Subject: {email.get('subject', '')}
Body: {email.get('body', '')}

Return ONLY valid JSON in this exact schema:

{{
  "category": "Complaint|Inquiry|Bug Report|Feature Request|Compliance|Legal|Billing|Spam|Internal|Other",
  "sentiment": "Positive|Neutral|Negative|Mixed",
  "sentiment_score": float,
  "urgency": "Critical|High|Medium|Low",
  "requires_human": boolean,
  "escalation_reason": string or null,
  "suggested_reply": string or null,
  "confidence": float,
  "detected_entities": {{
    "order_ids": [],
    "ticket_ids": [],
    "monetary_amounts": [],
    "deadlines": [],
    "products_mentioned": []
  }}
}}

IMPORTANT:
- Return ONLY JSON
- No markdown
- No explanation
"""


def classify_email_llm(
    email,
    thread_history=None,
    rag_context=None
):
    prompt = build_prompt(
    email,
    thread_history,
    rag_context
)
    print("\n===== RAG PROMPT =====")
    print(prompt[:1500])
    print("======================\n")

    response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ],
    temperature=0
)
    

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except Exception:
        return {
            "error": "Invalid JSON from LLM",
            "raw_output": content
        }