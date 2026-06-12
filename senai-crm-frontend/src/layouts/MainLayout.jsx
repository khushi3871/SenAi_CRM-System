import { Link, Outlet } from "react-router-dom";
const linkStyle = {
  color: "#cbd5e1",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "8px",
  transition: "0.2s"
};
export default function MainLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
  <div style={{
  width: "260px",
  background: "#0e3a65d7",
  color: "white",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  position: "fixed",
  left: 0,
  top: 0,
  height: "100vh",
  overflowY: "auto"
}}>
        <h2>SenAI CRM</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

  <Link
    to="/"
    style={linkStyle}
    onMouseEnter={(e) => e.target.style.background = "#1e293b"}
    onMouseLeave={(e) => e.target.style.background = "transparent"}
  >
    Dashboard
  </Link>

  <Link
    to="/emails"
    style={linkStyle}
    onMouseEnter={(e) => e.target.style.background = "#1e293b"}
    onMouseLeave={(e) => e.target.style.background = "transparent"}
  >
    Emails
  </Link>

  <Link
    to="/threads"
    style={linkStyle}
    onMouseEnter={(e) => e.target.style.background = "#1e293b"}
    onMouseLeave={(e) => e.target.style.background = "transparent"}
  >
    Threads
  </Link>

  <Link
    to="/analytics"
    style={linkStyle}
    onMouseEnter={(e) => e.target.style.background = "#1e293b"}
    onMouseLeave={(e) => e.target.style.background = "transparent"}
  >
    Analytics
  </Link>
  <Link
  to="/knowledge"
  style={linkStyle}
  onMouseEnter={(e) => e.target.style.background = "#1e293b"}
  onMouseLeave={(e) => e.target.style.background = "transparent"}
>
  Knowledge Base
</Link>

</nav>
      </div>

      {/* Main Content */}
      <div
  style={{
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    padding: "30px"
  }}
>
        <Outlet />
      </div>

    </div>
  );
}