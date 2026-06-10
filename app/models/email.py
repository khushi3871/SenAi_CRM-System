from sqlalchemy import Column, Integer, String, Text
from app.db.database import Base

class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)

    message_id = Column(String, unique=True, index=True)
    sender = Column(String)
    subject = Column(String)
    body = Column(Text)

    timestamp = Column(String)
    thread_id = Column(String)