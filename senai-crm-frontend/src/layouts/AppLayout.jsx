import { Link, Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: "12px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    color: isActive(path) ? "white" : "#94a3b8",
    background: isActive(path) ? "#2563eb" : "transparent",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    fontWeight: isActive(path) ? "600" : "400"
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        background: "#0b1220",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}>
        <h2 style={{ marginBottom: "25px" }}>SenAI CRM</h2>

        <Link to="/" style={linkStyle("/")}>Dashboard</Link>
        <Link to="/emails" style={linkStyle("/emails")}>Emails</Link>
        <Link to="/threads" style={linkStyle("/threads")}>Threads</Link>
        <Link to="/analytics" style={linkStyle("/analytics")}>Analytics</Link>
      </div>

      {/* MAIN AREA */}
      <div style={{
        flex: 1,
        background: "#f4f6f8",
        overflowY: "auto",
        padding: "20px"
      }}>
        <Outlet />
      </div>

    </div>
  );
}