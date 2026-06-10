from fastapi import FastAPI

from app.services.load_emails import load_emails
from app.services.email_service import get_all_emails
from app.db.database import engine, Base
from app.models import Email
from app.services.email_service import get_email_by_message_id
from app.services.email_service import get_all_threads
from app.services.email_service import get_thread_by_id
from app.services.email_service import enrich_email_with_ai
from app.services.email_service import get_sentiment_trend
from app.db.database import SessionLocal
from app.services.email_service import get_category_breakdown
from app.db.database import SessionLocal
from app.services.email_service import get_dashboard_stats
from app.services.email_service import detect_negative_trend

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "SenAI CRM Backend Running"
    }
@app.post("/load-emails")
def load_dataset():

    load_emails()

    return {
        "message": "Dataset loaded successfully"
    }
from app.db.database import SessionLocal
from app.models.email import Email

from typing import Optional


@app.get("/emails")
def fetch_emails(
    sender: Optional[str] = None,
    thread_id: Optional[str] = None
):
    db = SessionLocal()

    try:
        query = db.query(Email)

        if sender:
            query = query.filter(
                Email.sender == sender
            )

        if thread_id:
            query = query.filter(
                Email.thread_id == thread_id
            )

        return query.all()

    finally:
        db.close()

@app.get("/emails/{message_id}")
def fetch_email(message_id: str):
    db = SessionLocal()
    try:
        return get_email_by_message_id(db, message_id)
    finally:
        db.close()
@app.get("/threads")
def fetch_threads():
    db = SessionLocal()
    try:
        return get_all_threads(db)
    finally:
        db.close()
@app.get("/threads/{thread_id}")
def fetch_thread(thread_id: str):
    db = SessionLocal()
    try:
        return get_thread_by_id(db, thread_id)
    finally:
        db.close()
@app.get("/analytics/sentiment-trend")
def sentiment_trend(sender: str, days: int = 30):
    db = SessionLocal()

    try:
        return get_sentiment_trend(db, sender, days)
    finally:
        db.close()

@app.get("/analytics/category-breakdown")
def category_breakdown():
    db = SessionLocal()

    try:
        return get_category_breakdown(db)
    finally:
        db.close()

@app.get("/dashboard/stats")
def dashboard_stats():
    db = SessionLocal()

    try:
        return get_dashboard_stats(db)
    finally:
        db.close()

from app.api.rag_api import router as rag_router

app.include_router(rag_router)  

@app.get("/analytics/customer-risk/{sender}")
def customer_risk(sender: str):

    db = SessionLocal()

    try:
        return detect_negative_trend(
            db,
            sender
        )

    finally:
        db.close()