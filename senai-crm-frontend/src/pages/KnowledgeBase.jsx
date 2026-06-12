import { useState } from "react";
import api from "../api/client";

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchKnowledge = async (searchText = query) => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);

      const res = await api.get(
        `/rag/search?q=${encodeURIComponent(searchText)}`
      );

      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "refund after 20 days",
    "GDPR",
    "critical issue response time",
    "escalation",
    "SLA",
    "billing issue escalation"
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <div style={heroCard}>
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "38px"
          }}
        >
           AI Knowledge Assistant
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "16px",
            lineHeight: "1.7"
          }}
        >
          Search company policies, SLA rules,
          escalation procedures, compliance
          requirements and internal documentation.
        </p>
      </div>

      {/* SEARCH CARD */}
      <div style={searchCard}>
        <input
          type="text"
          placeholder="Ask anything about company policies..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchKnowledge();
            }
          }}
          style={input}
        />

        <button
          onClick={() => searchKnowledge()}
          style={searchBtn}
        >
          Search
        </button>
      </div>

      {/* QUICK SEARCHES */}
      <div style={chipsContainer}>
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => {
              setQuery(item);
              searchKnowledge(item);
            }}
            style={chip}
          >
            {item}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div style={loadingCard}>
          <h3>🤖 Searching Knowledge Base...</h3>

          <div
            style={{
              marginTop: "10px",
              color: "#475569"
            }}
          >
            ✓ Keyword Matching
            <br />
            ✓ Semantic Search
            <br />
            ✓ Ranking Results
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading &&
        results.length === 0 && (
          <div style={emptyState}>
            <h2>
              🔍 Start Exploring Knowledge
            </h2>

            <p
              style={{
                color: "#64748b"
              }}
            >
              Ask questions about company
              policies, compliance,
              refunds, SLA agreements,
              escalation procedures and
              customer support rules.
            </p>
          </div>
        )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <h2
            style={{
              marginBottom: "20px"
            }}
          >
            Search Results
          </h2>

          {results.map((item, index) => (
            <div
              key={index}
              style={resultCard}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "15px"
                }}
              >
                <span style={sourceBadge}>
                  📄 {item.source}
                </span>

                {item.score && (
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px"
                    }}
                  >
                    Score: {item.score}
                  </span>
                )}
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "15px",
                  borderRadius: "10px",
                  lineHeight: "1.8",
                  color: "#334155"
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------- */
/* STYLES */
/* ------------------- */

const heroCard = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  marginBottom: "20px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.04)"
};

const searchCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  display: "flex",
  gap: "10px",
  boxShadow:
    "0 8px 20px rgba(15,23,42,0.04)"
};

const input = {
  flex: 1,
  padding: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  outline: "none",
  fontSize: "15px"
};

const searchBtn = {
  padding: "14px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "600"
};

const chipsContainer = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px"
};

const chip = {
  padding: "8px 14px",
  borderRadius: "30px",
  border: "none",
  background: "#dbeafe",
  color: "#1d4ed8",
  cursor: "pointer",
  fontWeight: "600"
};

const loadingCard = {
  marginTop: "20px",
  background: "#eff6ff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #bfdbfe"
};

const emptyState = {
  marginTop: "25px",
  background: "#ffffff",
  padding: "50px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  textAlign: "center"
};

const resultCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
  marginBottom: "16px",
  boxShadow:
    "0 6px 18px rgba(15,23,42,0.04)"
};

const sourceBadge = {
  background: "#eff6ff",
  color: "#2563eb",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700"
};