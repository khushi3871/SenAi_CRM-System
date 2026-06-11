import { useEffect, useState } from "react";
import api from "../api/client";

export default function Threads() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [conversation, setConversation] = useState([]);

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

  return (
    <div>
      <h1>Threads</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {/* LEFT PANEL */}

        <div style={card}>
          <h3>All Threads</h3>

          {threads.map((thread) => (
            <div
              key={thread.thread_id}
              onClick={() => openThread(thread.thread_id)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                background:
                  selectedThread === thread.thread_id
                    ? "#2563eb"
                    : "#f8fafc",
                color:
                  selectedThread === thread.thread_id
                    ? "white"
                    : "black"
              }}
            >
              {thread.thread_id}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}

        <div style={card}>
          {!selectedThread ? (
            <p>Select a thread to view conversation</p>
          ) : (
            <>
              <h3>{selectedThread}</h3>

              <p>
                Total Messages: {conversation.length}
              </p>

              {conversation.map((email) => (
                <div
                  key={email.id}
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <strong>{email.sender}</strong>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b"
                      }}
                    >
                      {email.timestamp}
                    </span>
                  </div>

                  <h4
                    style={{
                      marginTop: "10px"
                    }}
                  >
                    {email.subject}
                  </h4>

                  <p
                    style={{
                      marginTop: "10px",
                      lineHeight: "1.6"
                    }}
                  >
                    {email.body}
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
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const tag = (value) => ({
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  color: "white",
  background:
    value?.toLowerCase() === "critical"
      ? "#dc2626"
      : value?.toLowerCase() === "complaint"
      ? "#ea580c"
      : value?.toLowerCase() === "legal"
      ? "#7c3aed"
      : "#2563eb"
});