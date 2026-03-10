import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getPendingRequestsForConnector } from "../data/mockData";
import NotificationBell from "./NotificationBell";
import UserSwitcher from "./UserSwitcher";
import logo from "../assets/logo.js";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const pending = getPendingRequestsForConnector(currentUser.id);

  const links = [
    { path: "/home", label: "Home" },
    { path: "/my-requests", label: "My Requests" },
    { path: "/requests", label: "Inbox", badge: pending.length },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="app-body">
      <nav className="app-nav">
        <div className="app-nav-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="WarmPath" />
        </div>
        <ul className="app-nav-links">
          {links.map(l => (
            <li key={l.path} style={{ position: "relative" }}>
              <Link
                to={l.path}
                className={`app-nav-link ${location.pathname === l.path ? "active" : ""}`}
              >
                {l.label}
                {l.badge > 0 && <span className="app-nav-badge">{l.badge}</span>}
              </Link>
            </li>
          ))}
          <li><NotificationBell /></li>
          <li><UserSwitcher /></li>
        </ul>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
