import json
import re
from app.agent.scenario_detector import ScenarioDetector
from app.services.email_service import get_email_by_message_id

from app.agent.tools import (
    tool_get_sentiment,
    tool_risk_check,
    tool_category_breakdown
)

from app.ai.utils import get_llm_response


class EmailAgent:

    def extract_json(self, text: str):
        """
        Clean LLM output and safely extract JSON.
        """
        try:
            cleaned = re.sub(r"```json|```", "", text).strip()

            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1

            json_str = cleaned[start:end]

            return json.loads(json_str)

        except Exception:
            return None

    # =====================================================
    # MAIN AGENT EXECUTION
    # =====================================================

    def run(self, db, email_id: str):

        email = get_email_by_message_id(db, email_id)

        if not email:
            return {
        "status": "FAILED",
        "reason": "Email not found"
    }

        scenario_result = ScenarioDetector.detect(email)

        print("SCENARIO RESULT =", scenario_result)

        if scenario_result:
            return {
        "email_id": email_id,
        "mode": "special_scenario_engine",
        **scenario_result
    }

        if not email:
            return {
                "status": "FAILED",
                "reason": "Email not found"
            }

        trace = []

        # -----------------------------------------------
        # TOOL 1 - SENTIMENT
        # -----------------------------------------------

        sentiment_data = tool_get_sentiment(email.sender)

        trace.append({
            "thought": "Need to understand sender sentiment history",
            "action": "tool_get_sentiment",
            "observation": sentiment_data
        })

        # -----------------------------------------------
        # TOOL 2 - RISK
        # -----------------------------------------------

        risk_data = tool_risk_check(email.sender)

        trace.append({
            "thought": "Need to determine churn or escalation risk",
            "action": "tool_risk_check",
            "observation": risk_data
        })

        # -----------------------------------------------
        # TOOL 3 - CATEGORY STATS
        # -----------------------------------------------

        category_data = tool_category_breakdown()

        trace.append({
            "thought": "Need business context from historical categories",
            "action": "tool_category_breakdown",
            "observation": category_data
        })

        # -----------------------------------------------
        # BUILD CONTEXT
        # -----------------------------------------------

        context = {
            "email": {
                "subject": email.subject,
                "body": email.body,
                "category": email.category,
                "sentiment": email.sentiment_score
            },
            "sentiment_analysis": sentiment_data,
            "risk_analysis": risk_data,
            "category_stats": category_data,
            "reasoning_trace": trace
        }

        prompt = f"""
You are a SenAI CRM Autonomous Agent.

You must analyze the email and available tool outputs.

Return ONLY valid JSON.

Rules:
- action must be one of:
  AUTO_PROCESS
  ESCALATE_TO_HUMAN
  PRIORITY_REVIEW

- no markdown
- no explanations
- no extra text

INPUT DATA:

{json.dumps(context, indent=2)}

OUTPUT FORMAT:

{{
  "final_category": "",
  "risk_level": "Low|Medium|High|Critical",
  "action": "",
  "reason": "",
  "next_step": ""
}}
"""

        response = get_llm_response(prompt)

        result = self.extract_json(response)

        if not result:
            return {
                "status": "ERROR",
                "raw_response": response,
                "trace": trace
            }

        trace.append({
            "thought": "All required information collected",
            "action": "LLM Decision Engine",
            "observation": {
                "action": result.get("action"),
                "risk_level": result.get("risk_level")
            }
        })

        result["email_id"] = email_id
        result["mode"] = "hybrid_multi_tool_agent"
        result["trace"] = trace

        return result

    # =====================================================
    # DRY RUN MODE
    # =====================================================

    def dry_run(self, db, email_id: str):

        email = get_email_by_message_id(db, email_id)

        if not email:
            return {
                "status": "FAILED",
                "reason": "Email not found"
            }

        plan = [
            {
                "step": 1,
                "action": "Retrieve sender sentiment history"
            },
            {
                "step": 2,
                "action": "Evaluate customer risk profile"
            },
            {
                "step": 3,
                "action": "Analyze category distribution"
            },
            {
                "step": 4,
                "action": "Generate AI decision"
            }
        ]

        return {
            "dry_run": True,
            "email_id": email_id,
            "subject": email.subject,
            "sender": email.sender,
            "planned_steps": plan,
            "message": "No actions executed. Planning mode only."
        }