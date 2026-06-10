import json

from app.db.database import SessionLocal
from app.models.email import Email


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
        count += 1

    db.commit()

    print(f"{count} emails loaded!")

    db.close()