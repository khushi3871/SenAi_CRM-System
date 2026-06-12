import { useEffect, useState } from "react";
import api from "../api/client";

import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashboardRes = await api.get(
        "/analytics/dashboard"
      );

      const categoryRes = await api.get(
        "/analytics/categories"
      );

      setStats(dashboardRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return <h2>Loading analytics...</h2>;
  }

  return (
    <div>
      {/* HERO */}
      <div style={heroBanner}>
        <h1
          style={{
            color: "#fff",
            marginBottom: "10px"
          }}
        >
          CRM Intelligence Hub
        </h1>

        <p
          style={{
            color: "#dbeafe",
            margin: 0,
            fontSize: "16px"
          }}
        >
          Real-time customer insights,
          sentiment monitoring,
          escalations and AI-powered
          email analytics.
        </p>
      </div>

      {/* AI INSIGHTS */}
      <div style={insightGrid}>
        <InsightBox
          title="Spam Detection"
          value={`${stats.spam_count} emails`}
          bg="#fef2f2"
        />

        <InsightBox
          title="Human Escalations"
          value={`${stats.escalated_count} emails`}
          bg="#fff7ed"
        />

        <InsightBox
          title="Customer Sentiment"
          value={
            stats.avg_sentiment > 0
              ? "Positive"
              : "Negative"
          }
          bg="#f0fdf4"
        />

        <InsightBox
          title="System Status"
          value="Operational"
          bg="#eff6ff"
        />
      </div>

      {/* KPI SECTION */}
      <div
        style={{
          ...kpiGrid,
          marginTop: "25px"
        }}
      >
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
          value={stats.avg_sentiment.toFixed(
            2
          )}
          color="#16a34a"
        />
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.3fr 1fr",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        {/* CATEGORY CHART */}

        <div style={card}>
          <h3>
            Category Distribution
          </h3>

          <div
            style={{
              height: 420
            }}
          >
            <ResponsiveContainer>
              <BarChart
                data={categories}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis type="number" />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={120}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[
                    0, 8, 8, 0
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY TABLE */}

        <div style={card}>
          <h3>
            Category Breakdown
          </h3>

          {categories.map((item) => (
            <div
              key={item.category}
              style={row}
            >
              <span>
                {item.category}
              </span>

              <span
                style={{
                  fontWeight: "700",
                  color: "#2563eb"
                }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RISK OVERVIEW */}

      <div
        style={{
          ...card,
          marginTop: "25px"
        }}
      >
        <h3>🚦 Risk Overview</h3>

        <RiskBar
          label="Critical"
          value={2}
          color="#dc2626"
        />

        <RiskBar
          label="High"
          value={8}
          color="#ea580c"
        />

        <RiskBar
          label="Medium"
          value={14}
          color="#eab308"
        />

        <RiskBar
          label="Low"
          value={36}
          color="#22c55e"
        />
      </div>
    </div>
  );
}

/* -------------------- */
/* COMPONENTS */
/* -------------------- */

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
          margin: 0
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function InsightBox({
  title,
  value,
  bg
}) {
  return (
    <div
      style={{
        background: bg,
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0"
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

      <h3
        style={{
          margin: 0
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function RiskBar({
  label,
  value,
  color
}) {
  return (
    <div
      style={{
        marginBottom: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between"
        }}
      >
        <span>{label}</span>

        <span>{value}</span>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e2e8f0",
          borderRadius: "10px",
          marginTop: "6px"
        }}
      >
        <div
          style={{
            width: `${value * 2}%`,
            height: "100%",
            background: color,
            borderRadius: "10px"
          }}
        />
      </div>
    </div>
  );
}

/* -------------------- */
/* STYLES */
/* -------------------- */

const heroBanner = {
  background:
    "linear-gradient(135deg,#1e3a8a,#2563eb)",
  padding: "35px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow:
    "0 15px 35px rgba(37,99,235,0.25)"
};

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
  background: "#fff",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
  boxShadow:
    "0 6px 18px rgba(15,23,42,0.05)"
};

const row = {
  display: "flex",
  justifyContent:
    "space-between",
  padding: "14px 0",
  borderBottom:
    "1px solid #e2e8f0"
};