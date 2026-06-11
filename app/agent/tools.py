from app.services.email_service import (
    get_email_by_message_id,
    get_all_threads,
    get_sentiment_trend,
    detect_negative_trend,
    get_category_breakdown
)

from app.db.database import SessionLocal


def tool_get_email(email_id: str):
    db = SessionLocal()
    try:
        return get_email_by_message_id(db, email_id)
    finally:
        db.close()


def tool_get_threads():
    db = SessionLocal()
    try:
        return get_all_threads(db)
    finally:
        db.close()


def tool_get_sentiment(sender: str):
    db = SessionLocal()
    try:
        return get_sentiment_trend(db, sender)
    finally:
        db.close()


def tool_risk_check(sender: str):
    db = SessionLocal()
    try:
        return detect_negative_trend(db, sender)
    finally:
        db.close()


def tool_category_breakdown():
    db = SessionLocal()
    try:
        return get_category_breakdown(db)
    finally:
        db.close()