import { useEffect, useState } from "react";
import api from "../api/client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashboardRes = await api.get("/analytics/dashboard");
      const categoryRes = await api.get("/analytics/categories");

      setStats(dashboardRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return <h2>Loading analytics...</h2>;
  }

  const pieColors = [
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#64748b",
    "#94a3b8",
    "#cbd5e1"
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>
        Analytics
      </h1>

      {/* KPI SECTION */}

      <div style={kpiGrid}>
        <MetricCard
          title="Total Emails"
          value={stats.total_emails}
          color="#3b82f6"
        />

        <MetricCard
          title="Complaints"
          value={stats.complaint_count}
          color="#ea580c"
        />

        <MetricCard
          title="Escalations"
          value={stats.escalated_count}
          color="#dc2626"
        />

        <MetricCard
          title="Avg Sentiment"
          value={stats.avg_sentiment.toFixed(2)}
          color="#16a34a"
        />
      </div>

      {/* MAIN GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        {/* PIE CHART */}

        <div style={card}>
          <h3>Category Distribution</h3>

          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  nameKey="category"
                  outerRadius={110}
                >
                  {categories.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        pieColors[
                          index % pieColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY TABLE */}

        <div style={card}>
          <h3>Category Breakdown</h3>

          {categories.map((item) => (
            <div
              key={item.category}
              style={row}
            >
              <span>{item.category}</span>

              <span
                style={{
                  fontWeight: "600"
                }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI INSIGHTS */}

      <div
        style={{
          marginTop: "25px"
        }}
      >
        <div style={card}>
          <h3>AI Insights</h3>

          <div style={insightGrid}>
            <InsightBox
              title="Spam Detection"
              value={`${stats.spam_count} emails`}
            />

            <InsightBox
              title="Human Escalations"
              value={`${stats.escalated_count} emails`}
            />

            <InsightBox
              title="Customer Sentiment"
              value={
                stats.avg_sentiment > 0
                  ? "Positive"
                  : "Negative"
              }
            />

            <InsightBox
              title="System Status"
              value="Operational"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color
}) {
  return (
    <div
      style={{
        ...card,
        borderTop: `4px solid ${color}`
      }}
    >
      <p
        style={{
          color: "#64748b",
          marginBottom: "10px"
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          color: "#0f172a"
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function InsightBox({
  title,
  value
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
      }}
    >
      <p
        style={{
          color: "#64748b",
          marginBottom: "8px"
        }}
      >
        {title}
      </p>

      <strong>{value}</strong>
    </div>
  );
}

const kpiGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px"
};

const insightGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px"
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow:
    "0 4px 12px rgba(15,23,42,0.05)"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #e2e8f0"
};