import { useEffect, useState } from "react";
import api from "../api/client";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [dashRes, emailRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/emails")
      ]);

      setStats(dashRes.data);
      setEmails(emailRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;

  const kpis = [
    { label: "Total Emails", value: stats.total_emails, color: "#2563eb" },
    { label: "Spam", value: stats.spam_count, color: "#ef4444" },
    { label: "Complaints", value: stats.complaint_count, color: "#f59e0b" },
    { label: "Leads", value: stats.lead_count, color: "#8b5cf6" },
    { label: "Escalations", value: stats.escalated_count, color: "#dc2626" },
    { label: "Avg Sentiment", value: stats.avg_sentiment.toFixed(2), color: "#10b981" }
  ];

  // CATEGORY DATA
  const categoryMap = {};
  emails.forEach(e => {
    const k = e.category || "Unknown";
    categoryMap[k] = (categoryMap[k] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map(k => ({
    name: k,
    value: categoryMap[k]
  }));

  const COLORS = ["#2563eb", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

  // SENTIMENT
  const sentimentData = emails.map((e, i) => ({
    name: i + 1,
    sentiment: e.sentiment_score
  }));

  // RISK
  const riskMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };

  emails.forEach(e => {
    const r = e.urgency || "Low";
    if (riskMap[r] !== undefined) riskMap[r]++;
  });

  const riskData = Object.keys(riskMap).map(k => ({
    name: k,
    value: riskMap[k]
  }));

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <h1 style={{ margin: 0 }}>SenAI CRM Dashboard</h1>
        <p style={{ margin: "5px 0 0", color: "#64748b" }}>
          AI-powered email intelligence overview
        </p>
      </div>

      {/* KPI GRID */}
      <div style={kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...kpiCard, borderLeft: `4px solid ${k.color}` }}>
            <p style={kpiLabel}>{k.label}</p>
            <h2 style={kpiValue}>{k.value}</h2>
          </div>
        ))}
      </div>

      {/* CHART GRID */}
      <div style={chartGrid}>

        {/* CATEGORY */}
        <div style={card}>
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={90}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SENTIMENT */}
        <div style={card}>
          <h3>Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sentiment" stroke="#2563eb" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RISK */}
        <div style={{ ...card, gridColumn: "span 2" }}>
          <h3>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  padding: "24px",
  background: "#f6f7fb",
  minHeight: "100vh"
};

const headerStyle = {
  marginBottom: "20px"
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  marginBottom: "24px"
};

const kpiCard = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
};

const kpiLabel = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px"
};

const kpiValue = {
  margin: "8px 0 0",
  fontSize: "22px"
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px"
};

const card = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
};