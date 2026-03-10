import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getPendingRequestsForConnector, getUserById, updateIntroRequestStatusWithTimestamp, introRequests, addNotification } from "../data/mockData";

export default function Requests() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [reqs, setReqs] = useState(() => getPendingRequestsForConnector(currentUser.id));
  const [editingId, setEditingId] = useState(null);
  const [editedMsg, setEditedMsg] = useState("");
  const initials = n => `${n.split(" ")[0][0]}${n.split(" ").pop()[0]}`;

  const approve = req => {
    const target = getUserById(req.targetId);
    updateIntroRequestStatusWithTimestamp(req.id, "approved");
    setReqs(reqs.filter(r => r.id !== req.id));
    addNotification({ userId: req.requesterId, type: "intro_approved", message: `${currentUser.name.replace(" (Jordan)", "")} approved your intro request to ${target.name}!`, relatedRequestId: req.id });
    navigate(`/intro/${req.id}`);
  };

  const decline = req => {
    const target = getUserById(req.targetId);
    updateIntroRequestStatusWithTimestamp(req.id, "declined");
    setReqs(reqs.filter(r => r.id !== req.id));
    addNotification({ userId: req.requesterId, type: "intro_declined", message: `Your intro request to ${target.name} wasn't approved this time.`, relatedRequestId: req.id });
  };

  if (!reqs.length) return (
    <div>
      <div className="app-eyebrow">Connector inbox</div>
      <h1 className="app-page-title">Intro Requests</h1>
      <div className="app-empty">
        <h2>All clear</h2>
        <p>When someone asks you to make an introduction, it'll appear here.</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="app-eyebrow">Connector inbox</div>
      <h1 className="app-page-title">Intro Requests</h1>
      <p className="app-page-sub">Review and decide — you're in full control.</p>

      {reqs.map(req => {
        const requester = getUserById(req.requesterId);
        const target = getUserById(req.targetId);
        const editing = editingId === req.id;

        return (
          <div key={req.id} className="app-card">
            <div className="app-mini-path">
              <div className="app-mini-node">
                <div className="app-mini-dot" style={{background:"var(--warm)"}}>{initials(requester.name)}</div>
                <span className="app-mini-name">{requester.name.split(" ")[0]}</span>
              </div>
              <span className="app-mini-arrow">→</span>
              <div className="app-mini-node">
                <div className="app-mini-dot" style={{background:"var(--dark)"}}>You</div>
                <span className="app-mini-name">You</span>
              </div>
              <span className="app-mini-arrow">→</span>
              <div className="app-mini-node">
                <div className="app-mini-dot" style={{background:"var(--warm-light)"}}>{initials(target.name)}</div>
                <span className="app-mini-name">{target.name.split(" ")[0]}</span>
              </div>
            </div>

            <p style={{fontSize:"0.78rem",color:"var(--mid)",marginBottom:"0.875rem"}}>
              {requester.name} ({requester.year}, {requester.major}) wants to meet {target.name}
            </p>

            {editing
              ? <textarea className="app-textarea" value={editedMsg} onChange={e => setEditedMsg(e.target.value)} rows={4} style={{marginBottom:"0.875rem"}} />
              : <div className="app-quote">{req.message}</div>
            }

            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",paddingTop:"0.5rem"}}>
              {editing ? (
                <>
                  <button className="app-btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  <button className="app-btn warm" onClick={() => { const i = introRequests.findIndex(r=>r.id===req.id); if(i!==-1) introRequests[i].message=editedMsg; setEditingId(null); approve({...req,message:editedMsg}); }}>Save & Approve</button>
                </>
              ) : (
                <>
                  <button className="app-btn ghost" onClick={() => decline(req)}>Decline</button>
                  <button className="app-btn outline" style={{fontSize:"0.76rem"}} onClick={() => { setEditingId(req.id); setEditedMsg(req.message); }}>Edit & Approve</button>
                  <button className="app-btn mid" onClick={() => approve(req)}>Approve ✓</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
