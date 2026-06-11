import { useState } from "react";
import api from "../api/client";

export default function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchKnowledge = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await api.get(
        `/rag/search?q=${encodeURIComponent(query)}`
      );

      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Knowledge Base Search</h1>

      <div style={searchCard}>
        <input
          type="text"
          placeholder="Search company policies, refunds, compliance..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          style={input}
        />

        <button
          onClick={searchKnowledge}
          style={searchBtn}
        >
          Search
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: "20px" }}>
          Searching knowledge base...
        </p>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {results.map((item, index) => (
            <div
              key={index}
              style={resultCard}
            >
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <span style={sourceBadge}>
                  {item.source}
                </span>
              </div>

              <p
                style={{
                  lineHeight: "1.7",
                  color: "#334155"
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const searchCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  display: "flex",
  gap: "10px",
  marginTop: "20px"
};

const input = {
  flex: 1,
  padding: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  outline: "none"
};

const searchBtn = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const resultCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  marginBottom: "15px",
  boxShadow:
    "0 4px 12px rgba(15,23,42,0.05)"
};

const sourceBadge = {
  background: "#eff6ff",
  color: "#2563eb",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600"
};