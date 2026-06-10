import json

from app.db.database import SessionLocal
from app.models.email import Email
from app.services.email_service import enrich_email_with_ai


def load_emails():

    db = SessionLocal()

    with open(
        "data/email-data-advanced.json",
        "r",
        encoding="utf-8"
    ) as f:
        emails = json.load(f)

    count = 0

    for email in emails:

        existing = (
            db.query(Email)
            .filter(
                Email.message_id == email["message_id"]
            )
            .first()
        )

        if existing:
            continue

        db_email = Email(
            message_id=email["message_id"],
            sender=email["sender"],
            subject=email["subject"],
            body=email["body"],
            timestamp=email["timestamp"],
            thread_id=email["thread_id"]
        )

        db.add(db_email)
        db.commit()

        # AI enrichment
        enrich_email_with_ai(db, db_email)

        count += 1

    print(f"{count} emails loaded!")

    db.close()