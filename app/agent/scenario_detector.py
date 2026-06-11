class ScenarioDetector:

    @staticmethod
    def detect(email):

        text = f"{email.subject} {email.body}".lower()

        # ----------------------------------
        # GDPR REQUEST
        # ----------------------------------

        gdpr_keywords = [
            "gdpr",
            "article 20",
            "data portability",
            "delete my data",
            "personal data",
            "export my data"
        ]

        if any(word in text for word in gdpr_keywords):
            return {
                "scenario": "GDPR_REQUEST",
                "risk_level": "High",
                "action": "LEGAL_ESCALATION",
                "reason": "Formal GDPR request detected"
            }

        # ----------------------------------
        # RANSOMWARE THREAT
        # ----------------------------------

        ransomware_keywords = [
            "btc",
            "bitcoin",
            "ransomware",
            "publish data",
            "pay us",
            "2 btc",
            "crypto payment"
        ]

        if any(word in text for word in ransomware_keywords):
            return {
                "scenario": "RANSOMWARE_THREAT",
                "risk_level": "Critical",
                "action": "SECURITY_ESCALATION",
                "reason": "Possible ransomware threat detected"
            }

        # ----------------------------------
        # SLA BREACH
        # ----------------------------------

        sla_keywords = [
    "sla breach",
    "legal review",
    "outage",
    "downtime",
    "service unavailable",
    "production down",
    "production system down",
    "system down",
    "critical issue",
    "service disruption",
    "financial loss",
    "urgent"
]

        if any(word in text for word in sla_keywords):
            return {
                "scenario": "SLA_BREACH",
                "risk_level": "Critical",
                "action": "PRIORITY_REVIEW",
                "reason": "SLA breach or production outage detected"
            }

        # ----------------------------------
        # CHURN RISK
        # ----------------------------------

        churn_keywords = [
            "cancel subscription",
            "switch competitor",
            "refund",
            "public review",
            "trustpilot",
            "g2 review",
            "leave your service"
        ]

        if any(word in text for word in churn_keywords):
            return {
                "scenario": "CHURN_RISK",
                "risk_level": "High",
                "action": "ESCALATE_TO_HUMAN",
                "reason": "Potential churn detected"
            }

        return None
    
        text = f"{email.subject} {email.body}".lower()

        print("EMAIL TEXT:")
        print(text)