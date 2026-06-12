import { useEffect, useState } from "react";
import api from "../api/client";

export default function Threads() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await api.get("/threads");
      setThreads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openThread = async (threadId) => {
    try {
      const res = await api.get(`/threads/${threadId}`);

      setSelectedThread(threadId);
      setConversation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredThreads = threads.filter((thread) =>
    thread.thread_id
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}

      <div
         style={{
    marginBottom: "30px"
  }}
      >
        

        <div>
          <h1
    style={{
      margin: 0,
      fontSize: "48px",
      fontWeight: "800",
      color: "#0f172a"
    }}
  >
    Threads
  </h1>

          <p
    style={{
      marginTop: "8px",
      color: "#64748b",
      fontSize: "18px"
    }}
  >
    Monitor customer conversations and email discussions
  </p>
        </div>
      </div>

      {/* STATS */}

      <div style={statsGrid}>
        <StatCard
          title="Total Threads"
          value={threads.length}
          icon=""
          color="#2563eb"
        />

        <StatCard
          title="Active"
          value={threads.length}
          icon=""
          color="#16a34a"
        />

        <StatCard
          title="Selected"
          value={selectedThread ? "1" : "0"}
          icon=""
          color="#7c3aed"
        />

        <StatCard
          title="Messages"
          value={conversation.length}
          icon=""
          color="#f59e0b"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: "25px",
          marginTop: "25px"
        }}
      >
        {/* LEFT PANEL */}

        <div style={card}>
          <h3>Inbox Threads</h3>

          <input
            type="text"
            placeholder="Search threads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={searchInput}
          />

          <div
            style={{
              marginTop: "20px",
              maxHeight: "700px",
              overflowY: "auto"
            }}
          >
            {filteredThreads.map((thread) => (
              <div
                key={thread.thread_id}
                onClick={() =>
                  openThread(thread.thread_id)
                }
                style={{
                  padding: "15px",
                  marginBottom: "12px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  transition: "0.2s",
                  background:
                    selectedThread ===
                    thread.thread_id
                      ? "#2563eb"
                      : "#ffffff",

                  color:
                    selectedThread ===
                    thread.thread_id
                      ? "#fff"
                      : "#0f172a",

                  border:
                    selectedThread ===
                    thread.thread_id
                      ? "none"
                      : "1px solid #e2e8f0",

                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    marginBottom: "6px"
                  }}
                >
                  {" "}
                  {thread.thread_id.replace(
                    "thread_",
                    ""
                  )}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.8
                  }}
                >
                  Click to open conversation
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div style={card}>
          {!selectedThread ? (
            <div style={emptyState}>
              <div
                style={{
                  fontSize: "60px"
                }}
              >
                
              </div>

              <h2>Select a Thread</h2>

              <p>
                View customer conversations,
                analyze sentiment and monitor
                escalation risks.
              </p>
            </div>
          ) : (
            <>
              {/* AI SUMMARY */}

              <div style={aiBanner}>
                <h2
                  style={{
                    marginTop: 0
                  }}
                >
                   AI Thread Summary
                </h2>

                <p>
                  This conversation contains{" "}
                  <strong>
                    {conversation.length}
                  </strong>{" "}
                  messages.
                </p>

                <p>
                  Monitor sentiment trends and
                  identify escalation risks.
                </p>
              </div>

              <h2>{selectedThread}</h2>

              <p
                style={{
                  color: "#64748b"
                }}
              >
                Total Messages:{" "}
                {conversation.length}
              </p>

              {conversation.map((email) => (
                <div
                  key={email.id}
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    borderRadius: "18px",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center"
                    }}
                  >
                    <strong>
                      👤 {email.sender}
                    </strong>

                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "12px"
                      }}
                    >
                      {email.timestamp}
                    </span>
                  </div>

                  <h3
                    style={{
                      marginTop: "15px"
                    }}
                  >
                    {email.subject}
                  </h3>

                  <p
                    style={{
                      lineHeight: "1.8",
                      color: "#334155"
                    }}
                  >
                    {email.body}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px"
                    }}
                  >
                    <span
                      style={categoryTag(
                        email.category
                      )}
                    >
                      {email.category}
                    </span>

                    <span
                      style={urgencyTag(
                        email.urgency
                      )}
                    >
                      {email.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({
  title,
  value,
  icon,
  color
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        borderTop: `5px solid ${color}`,
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.05)"
      }}
    >
      <div
        style={{
          fontSize: "24px"
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#64748b"
        }}
      >
        {title}
      </p>

      <h2>{value}</h2>
    </div>
  );
}

/* STYLES */

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px"
};

const card = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "24px",
  boxShadow:
    "0 10px 30px rgba(15,23,42,0.08)"
};

const searchInput = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  marginTop: "10px",
  outline: "none"
};

const headerIcon = {
  width: "60px",
  height: "60px",
  borderRadius: "18px",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "28px"
};

const aiBanner = {
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "white",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow:
    "0 10px 25px rgba(37,99,235,0.3)"
};

const emptyState = {
  textAlign: "center",
  padding: "100px 20px",
  color: "#64748b"
};

const categoryTag = (category) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#fff",
  background:
    category === "Complaint"
      ? "#f59e0b"
      : category === "Bug Report"
      ? "#06b6d4"
      : category === "Spam"
      ? "#ef4444"
      : category === "Compliance"
      ? "#8b5cf6"
      : "#2563eb"
});

const urgencyTag = (urgency) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#fff",
  background:
    urgency === "Critical"
      ? "#dc2626"
      : urgency === "High"
      ? "#ea580c"
      : urgency === "Medium"
      ? "#eab308"
      : "#16a34a"
});