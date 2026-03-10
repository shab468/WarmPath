import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getRequestsByRequester, getUserById } from "../data/mockData";

export default function MyRequests() {
  const { currentUser } = useUser();
  const [filter, setFilter] = useState("all");
  const [reqs, setReqs] = useState([]);
  const initials = n => `${n.split(" ")[0][0]}${n.split(" ").pop()[0]}`;

  useEffect(() => { setReqs(getRequestsByRequester(currentUser.id)); }, [currentUser.id]);

  const filtered = reqs.filter(r => filter === "all" || r.status === filter);

  const fmtDate = ts => {
    const d = Math.floor((Date.now() - new Date(ts)) / 86400000);
    if (d === 0) return "Today"; if (d === 1) return "Yesterday";
    if (d < 7) return `${d} days ago`;
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const tabs = [
    { id: "all", label: "All", n: reqs.length },
    { id: "pending", label: "Pending", n: reqs.filter(r=>r.status==="pending").length },
    { id: "approved", label: "Approved", n: reqs.filter(r=>r.status==="approved").length },
    { id: "declined", label: "Declined", n: reqs.filter(r=>r.status==="declined").length },
  ];

  if (!reqs.length) return (
    <div>
      <div className="app-eyebrow">Your requests</div>
      <h1 className="app-page-title">My Intro Requests</h1>
      <div className="app-empty">
        <h2>No requests yet</h2>
        <p>When you request introductions through your network, they'll appear here.</p>
        <Link to="/home" className="app-btn warm">Find Paths</Link>
      </div>
    </div>
  );

  return (
    <div>
      <div className="app-eyebrow">Your requests</div>
      <h1 className="app-page-title">My Intro Requests</h1>
      <p className="app-page-sub">Track the status of introductions you've requested.</p>

      <div className="app-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`app-tab ${filter===t.id?"on":""}`} onClick={() => setFilter(t.id)}>
            {t.label}{t.n > 0 && <span className="app-tab-n">{t.n}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={{textAlign:"center",padding:"2rem",fontSize:"0.82rem",color:"var(--mid)"}}>No {filter} requests</div>
        : filtered.map(req => {
            const connector = getUserById(req.connectorId);
            const target = getUserById(req.targetId);
            return (
              <div key={req.id} className="app-card">
                <div className="app-mini-path">
                  <div className="app-mini-node">
                    <div className="app-mini-dot" style={{background:"var(--warm)"}}>You</div>
                    <span className="app-mini-name">You</span>
                  </div>
                  <span className="app-mini-arrow">→</span>
                  <div className="app-mini-node">
                    <div className="app-mini-dot" style={{background:"var(--dark)"}}>{initials(connector.name)}</div>
                    <span className="app-mini-name">{connector.name.split(" ")[0]}</span>
                  </div>
                  <span className="app-mini-arrow">→</span>
                  <div className="app-mini-node">
                    <div className="app-mini-dot" style={{background:"var(--warm-light)"}}>{initials(target.name)}</div>
                    <span className="app-mini-name">{target.name.split(" ")[0]}</span>
                  </div>
                </div>

                <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  <span className={`app-tag ${req.status}`}>{req.status === "pending" ? "Pending" : req.status === "approved" ? "Approved" : "Not approved"}</span>
                  <span style={{fontSize:"0.72rem",color:"var(--mid)"}}>{fmtDate(req.updatedAt || req.createdAt)}</span>
                </div>

                <div className="app-quote" style={{fontSize:"0.8rem",marginTop:0}}>{req.message}</div>

                <div className="app-req-foot">
                  {req.status === "approved" && <Link to={`/intro/${req.id}`} className="app-btn warm" style={{fontSize:"0.76rem",padding:"0.5rem 1.1rem"}}>View Introduction →</Link>}
                  {req.status === "pending" && <span style={{fontSize:"0.78rem",color:"var(--mid)"}}>Waiting for {connector.name.split(" ")[0]}…</span>}
                  {req.status === "declined" && <span style={{fontSize:"0.78rem",color:"var(--mid)"}}>Not approved. <Link to="/home" style={{color:"var(--warm)"}}>Try another path?</Link></span>}
                </div>
              </div>
            );
          })
      }
    </div>
  );
}
