from fastapi import FastAPI
from typing import Optional
from app.agent.agent_controller import EmailAgent

from app.db.database import engine, Base, SessionLocal

from app.models.email import Email


from app.services.load_emails import load_emails
from app.services.email_service import (
    get_email_by_message_id,
    get_all_threads,
    get_thread_by_id,
    debug_unique_senders as get_unique_senders
)

from app.api.rag_api import router as rag_router
from app.routers.analytics import router as analytics_router

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ------------------------
# CORE ROUTES
# ------------------------

@app.get("/")
def home():
    return {"message": "SenAI CRM Backend Running"}


@app.post("/load-emails")
def load_dataset():
    load_emails()
    return {"message": "Dataset loaded successfully"}


@app.get("/emails")
def fetch_emails(sender: Optional[str] = None, thread_id: Optional[str] = None):
    db = SessionLocal()
    try:
        query = db.query(Email)

        if sender:
            query = query.filter(Email.sender == sender)

        if thread_id:
            query = query.filter(Email.thread_id == thread_id)

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


# ------------------------
# DEBUG ROUTE
# ------------------------

@app.get("/debug/senders")
def debug_senders():
    db = SessionLocal()
    try:
        return get_unique_senders(db)
    finally:
        db.close()


# ------------------------
# ROUTERS
# ------------------------

app.include_router(rag_router)
app.include_router(analytics_router)
@app.get("/agent/run/{email_id}")
def run_agent(email_id: str):
    db = SessionLocal()
    try:
        agent = EmailAgent()
        return agent.run(db, email_id)
    finally:
        db.close()

@app.post("/agent/dry-run/{email_id}")
def dry_run_agent(email_id: str):

    db = SessionLocal()

    try:
        agent = EmailAgent()
        return agent.dry_run(db, email_id)

    finally:
        db.close()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
