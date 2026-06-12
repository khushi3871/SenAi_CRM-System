import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function EmailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [agentResult, setAgentResult] = useState(null);
  const [agentLoading, setAgentLoading] = useState(false);

  const [dryRunResult, setDryRunResult] = useState(null);

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      const res = await api.get(`/emails/${id}`);
      setEmail(res.data);
    } catch (err) {
      console.error("Error fetching email:", err);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async () => {
    try {
      setAgentLoading(true);

      const res = await api.get(`/agent/run/${id}`);

      setAgentResult(res.data);
    } catch (err) {
      console.error("Agent error:", err);
    } finally {
      setAgentLoading(false);
    }
  };

  const runDryRun = async () => {
    try {
      const res = await api.post(`/agent/dry-run/${id}`);
      setDryRunResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  if (!email) return <h2>Email not found</h2>;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px"
      }}
    >
      <button
        onClick={() => navigate("/emails")}
        style={btn}
      >
        Back
      </button>

      <h1 style={{ marginTop: "20px" }}>
        Email Details
      </h1>

      <div style={card}>
        <h2>{email.subject}</h2>

        <p>
          <strong>Sender:</strong> {email.sender}
        </p>

        <p>
          <strong>Thread:</strong> {email.thread_id}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px"
          }}
        >
          <span style={tag(email.category)}>
            {email.category}
          </span>

          <span style={tag(email.urgency)}>
            {email.urgency}
          </span>
        </div>
      </div>

      <div style={card}>
        <h3>Email Content</h3>

        <p
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.7"
          }}
        >
          {email.body}
        </p>
      </div>

      <div
        style={{
          ...card,
          background: "#223367",
          color: "#fff"
        }}
      >
        <h3>AI Insights</h3>

        <p>
          <strong>Sentiment:</strong>{" "}
          {email.sentiment_score}
        </p>

        <p>
          <strong>Confidence:</strong>{" "}
          {email.confidence}
        </p>

        <p>
          <strong>Requires Human:</strong>{" "}
          {email.requires_human ? "YES" : "NO"}
        </p>
      </div>

      <div style={card}>
        <h3>Agent Actions</h3>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >
          <button
            onClick={runAgent}
            style={primaryBtn}
          >
            {agentLoading
              ? "Running..."
              : "Run Agent"}
          </button>

          <button
            onClick={runDryRun}
            style={secondaryBtn}
          >
            Dry Run
          </button>
        </div>

        {agentResult && (
          <div style={agentCard}>
            <h3>Agent Decision</h3>

            <p>
              <strong>Mode:</strong>{" "}
              {agentResult.mode}
            </p>

            {agentResult.final_category && (
              <p>
                <strong>Category:</strong>{" "}
                {agentResult.final_category}
              </p>
            )}

            <p>
              <strong>Action:</strong>{" "}
              {agentResult.action}
            </p>

            <p>
              <strong>Risk:</strong>{" "}
              <span
                style={{
                  color: getRiskColor(
                    agentResult.risk_level
                  ),
                  fontWeight: "bold"
                }}
              >
                {agentResult.risk_level}
              </span>
            </p>

            <p>
              <strong>Reason:</strong>{" "}
              {agentResult.reason}
            </p>

            {agentResult.scenario && (
              <div style={alertBox}>
                {agentResult.scenario}
              </div>
            )}
          </div>
        )}
      </div>

      {agentResult?.trace && (
  <details style={card}>
    <summary
      style={{
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "18px"
      }}
    >
      View Agent Trace
    </summary>

    <div style={{ marginTop: "20px" }}>
      {agentResult.trace.map((step, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0"
          }}
        >
          <p>
            <strong>Step {index + 1}</strong>
          </p>

          <p>{step.thought}</p>

          <p
            style={{
              color: "#2563eb",
              fontWeight: "600"
            }}
          >
            {step.action}
          </p>
        </div>
      ))}
    </div>
  </details>
)}

      {dryRunResult && (
  <div style={card}>
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
      }}
    >
      Agent Thinking
    </h3>

    {dryRunResult.planned_steps.map((step, index) => (
      <div
        key={step.step}
        style={{
          marginBottom: "16px",
          padding: "18px",
          borderRadius: "14px",
          background: "#f8fafc",
          borderLeft: "4px solid #3b82f6",
          transition: "0.2s"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px"
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            ✓
          </span>

          <strong>
            Step {step.step}
          </strong>
        </div>

        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: "1.6"
          }}
        >
          {step.action}
        </p>
      </div>
    ))}

    <div
      style={{
        marginTop: "25px",
        padding: "18px",
        borderRadius: "14px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe"
      }}
    >
      <h4
        style={{
          marginTop: 0,
          color: "#1e40af"
        }}
      >
        Final Decision
      </h4>

      <p
        style={{
          marginBottom: 0,
          color: "#334155"
        }}
      >
        Agent has completed planning and is ready
        to evaluate sender history, risk profile,
        category distribution and generate a final
        recommendation.
      </p>
    </div>
  </div>
)}
    </div>
  );
}

const card = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "16px",
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.05)"
};

const btn = {
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#fff",
  cursor: "pointer"
};

const primaryBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#7c3aed",
  color: "#fff",
  cursor: "pointer"
};

const agentCard = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  background: "#f8fafc"
};

const traceItem = {
  borderLeft: "4px solid #2563eb",
  paddingLeft: "15px",
  marginBottom: "20px"
};

const traceBox = {
  background: "#f1f5f9",
  padding: "12px",
  borderRadius: "8px",
  overflowX: "auto"
};

const alertBox = {
  marginTop: "15px",
  padding: "12px",
  borderRadius: "8px",
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: "600"
};

const getRiskColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case "critical":
      return "#dc2626";
    case "high":
      return "#ea580c";
    case "medium":
      return "#ca8a04";
    default:
      return "#16a34a";
  }
};

const tag = (type) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  color: "#fff",
  fontSize: "12px",
  background:
    type?.toLowerCase() === "spam"
      ? "#ef4444"
      : type?.toLowerCase() === "complaint"
      ? "#f59e0b"
      : type?.toLowerCase() === "critical"
      ? "#dc2626"
      : "#2563eb"
});