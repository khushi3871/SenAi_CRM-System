from fastapi import APIRouter
from app.db.database import SessionLocal
from app.services.email_service import (
    get_dashboard_stats,
    get_category_breakdown,
    detect_negative_trend,
    get_sentiment_trend
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/dashboard")
def dashboard_stats():
    db = SessionLocal()
    try:
        return get_dashboard_stats(db)
    finally:
        db.close()


@router.get("/categories")
def category_breakdown():
    db = SessionLocal()
    try:
        return get_category_breakdown(db)
    finally:
        db.close()


@router.get("/customer-risk/{sender}")
def customer_risk(sender: str):
    db = SessionLocal()
    try:
        return detect_negative_trend(db, sender)
    finally:
        db.close()


@router.get("/sentiment/{sender}")
def sentiment_trend(sender: str, days: int = 30):
    db = SessionLocal()
    try:
        return get_sentiment_trend(db, sender, days)
    finally:
        db.close()