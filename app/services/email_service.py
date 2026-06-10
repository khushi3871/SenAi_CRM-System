from sqlalchemy.orm import Session
from app.models.email import Email
from app.ai.classifier import classify_email_llm
from app.rag.vector_store import VectorStore


vs = VectorStore()
vs.build_index()

def get_all_emails(db: Session):
    return db.query(Email).all()


def get_email_by_message_id(db: Session, message_id: str):
    return db.query(Email).filter(
        Email.message_id == message_id
    ).first()


def get_thread_by_id(db: Session, thread_id: str):
    return db.query(Email).filter(
        Email.thread_id == thread_id
    ).all()

def get_all_threads(db: Session):
    threads = db.query(Email.thread_id).distinct().all()
    return [{"thread_id": thread[0]} for thread in threads]

def enrich_email_with_ai(db: Session, email: Email):
    """
    Runs LLM classification and updates DB record
    """
    # STEP 1: Retrieve relevant company knowledge
    rag_context = vs.search(email.body, top_k=3)

    context_text = "\n".join(
    [f"{c['source']}: {c['text']}" for c in rag_context]
)
    email_data = {
        "subject": email.subject,
        "body": email.body
    }

    thread_history = get_thread_context(db, email.thread_id)

    ai_result = classify_email_llm(
    email_data,
    thread_history=thread_history,
    rag_context=context_text
)

    # Safety check (VERY important for production systems)
    if isinstance(ai_result, dict) and "error" not in ai_result:

        email.category = ai_result.get("category")
        email.sentiment_score = ai_result.get("sentiment_score")
        email.urgency = ai_result.get("urgency")
        email.requires_human = ai_result.get("requires_human")
        email.confidence = ai_result.get("confidence")

        db.commit()

    return email
def get_thread_context(db, thread_id):
    """
    Fetch full conversation history for AI context
    """

    emails = (
        db.query(Email)
        .filter(Email.thread_id == thread_id)
        .order_by(Email.timestamp.asc())
        .all()
    )

    formatted = []

    for e in emails:
        formatted.append(
            f"{e.sender}: {e.subject} - {e.body}"
        )

    return "\n".join(formatted)

from datetime import datetime, timedelta


def get_sentiment_trend(db, sender_email: str, days: int = 30):
    """
    Returns sentiment trend data for a sender
    """

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    emails = (
        db.query(Email)
        .filter(
            Email.sender == sender_email,
            Email.timestamp >= cutoff_date
        )
        .order_by(Email.timestamp.asc())
        .all()
    )

    trend = []

    for e in emails:
        trend.append({
            "timestamp": e.timestamp,
            "sentiment_score": e.sentiment_score or 0
        })

    return trend

def detect_negative_trend(db, sender_email: str, window: int = 3):
    """
    Detects if sender has consecutive negative sentiment trend
    """

    emails = (
        db.query(Email)
        .filter(Email.sender == sender_email)
        .order_by(Email.timestamp.asc())
        .all()
    )

    negative_streak = 0

    for e in emails:
        score = e.sentiment_score or 0

        if score < -0.3:
            negative_streak += 1
        else:
            negative_streak = 0

        if negative_streak >= window:
            return {
                "risk": "HIGH",
                "reason": f"{window}+ consecutive negative emails detected",
                "recommendation": "ESCALATE_TO_HUMAN"
            }

    return {
        "risk": "LOW",
        "reason": "No sustained negative trend",
        "recommendation": "AUTO_PROCESS"
    }
from sqlalchemy import func

def get_category_breakdown(db):
    """
    Returns count of emails grouped by category
    """

    results = (
        db.query(
            Email.category,
            func.count(Email.id)
        )
        .group_by(Email.category)
        .all()
    )

    return [
        {
            "category": r[0],
            "count": r[1]
        }
        for r in results
    ]
from sqlalchemy import func

def get_dashboard_stats(db):
    """
    Returns high-level CRM stats for dashboard
    """

    total_emails = db.query(func.count(Email.id)).scalar()

    spam_count = db.query(func.count(Email.id)).filter(Email.category == "Spam").scalar()
    lead_count = db.query(func.count(Email.id)).filter(Email.category == "Lead").scalar()
    complaint_count = db.query(func.count(Email.id)).filter(Email.category == "Complaint").scalar()

    escalated_count = db.query(func.count(Email.id)).filter(
        Email.requires_human == True
    ).scalar()

    avg_sentiment = db.query(func.avg(Email.sentiment_score)).scalar()

    return {
        "total_emails": total_emails,
        "spam_count": spam_count,
        "lead_count": lead_count,
        "complaint_count": complaint_count,
        "escalated_count": escalated_count,
        "avg_sentiment": float(avg_sentiment or 0)
    }