import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dumbbell, LogOut, Menu, X } from "lucide-react";
import { getCurrentUser, logout } from "../utils/auth";
import "./DashboardLayout.css";

function DashboardShell({ title, navItems, children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dash-shell">
      {open && <div className="dash-overlay" onClick={() => setOpen(false)} />}

      <aside className={`dash-sidebar ${open ? "open" : ""}`}>
        <Link to="/" className="dash-brand">
          <Dumbbell size={22} />
          FITCORE
        </Link>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="nav-link" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="menu-btn" type="button" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>
            <strong>{title}</strong>
          </div>
          <div className="dash-user">
            <span>{user?.name || "User"}</span>
            <button className="menu-btn" type="button" onClick={() => setOpen(false)} style={{ display: open ? "inline-flex" : "none" }}>
              <X size={18} />
            </button>
          </div>
        </header>
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
