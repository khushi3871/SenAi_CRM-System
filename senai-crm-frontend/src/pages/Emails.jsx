import { useEffect, useState } from "react";
import api from "../api/client";

export default function Emails() {
  const [emails, setEmails] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, emails]);

  const fetchEmails = async () => {
    try {
      const res = await api.get("/emails");
      setEmails(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeCategory = (cat) => {
    const c = cat?.toLowerCase();

    if (!c) return "";

    if (c.includes("spam")) return "spam";
    if (c.includes("complaint")) return "complaint";
    if (
      c.includes("inquiry") ||
      c.includes("query") ||
      c.includes("support") ||
      c.includes("bug") ||
      c.includes("issue")
    )
      return "query";

    if (c.includes("lead") || c.includes("sales")) return "lead";

    return c;
  };

  const applyFilters = () => {
    let data = [...emails];

    if (search) {
      data = data.filter(
        (e) =>
          e.sender?.toLowerCase().includes(search.toLowerCase()) ||
          e.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "ALL") {
      data = data.filter(
        (e) =>
          normalizeCategory(e.category) === category.toLowerCase()
      );
    }

    setFiltered(data);
  };

  if (loading) return <h2>Loading emails...</h2>;

  return (
    <div>
      <h1>📧 Emails</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <input
          placeholder="Search sender or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        >
          <option value="ALL">All</option>
          <option value="complaint">Complaint</option>
          <option value="spam">Spam</option>
          <option value="query">Query</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1e293b", color: "white" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Sender</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Subject</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Category</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Sentiment</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Urgency</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((email) => (
            <tr
              key={email.id}
              onClick={() =>
                window.location.href = `/emails/${email.message_id}`
              }
              style={{
                borderBottom: "1px solid #ddd",
                cursor: "pointer"
              }}
            >
              <td style={{ padding: "10px" }}>{email.id}</td>
              <td style={{ padding: "10px" }}>{email.sender}</td>
              <td style={{ padding: "10px" }}>{email.subject}</td>
              <td style={{ padding: "10px" }}>{email.category}</td>
              <td style={{ padding: "10px" }}>{email.sentiment_score}</td>
              <td style={{ padding: "10px" }}>{email.urgency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}