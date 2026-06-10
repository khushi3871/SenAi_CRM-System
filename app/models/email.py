from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean
)
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

    # AI Fields
    category = Column(String)
    sentiment_score = Column(Float)
    urgency = Column(String)
    requires_human = Column(Boolean)
    confidence = Column(Float)