from sqlalchemy.orm import Session
from app.models.email import Email


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