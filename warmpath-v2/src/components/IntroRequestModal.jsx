import { useState } from "react";
import { generateIntroMessage, addIntroRequest, addNotification } from "../data/mockData";

export default function IntroRequestModal({ currentUser, connector, target, intent, onClose }) {
  const [msg, setMsg] = useState(() => generateIntroMessage(currentUser, connector.user, target.user, {
    description: intent.description || `looking for help with ${intent.category}`
  }));
  const [status, setStatus] = useState("idle");

  const send = () => {
    setStatus("sending");
    setTimeout(() => {
      const req = addIntroRequest({ intentId: null, requesterId: currentUser.id, connectorId: connector.user.id, targetId: target.user.id, message: msg, status: "pending" });
      addNotification({ userId: connector.user.id, type: "intro_request", message: `${currentUser.name.replace(" (Jordan)", "")} is asking you to introduce them to ${target.user.name}`, relatedRequestId: req.id });
      setStatus("sent");
    }, 500);
  };

  if (status === "sent") return (
    <div className="app-overlay">
      <div className="app-modal">
        <div className="app-modal-success">
          <div className="app-success-icon">
            <svg width="24" height="24" fill="none" stroke="var(--mid)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2>Request Sent</h2>
          <p>{connector.user.name.split(" ")[0]} will review your request and connect you with {target.user.name.split(" ")[0]} if it's a good fit.</p>
          <p>If they don't respond, the request quietly expires — no awkwardness.</p>
          <button className="app-btn warm" style={{marginTop:"1.5rem",padding:"0.75rem 2rem"}} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="app-modal">
        <div className="app-modal-head">
          <h2>Request Introduction</h2>
          <p>via {connector.user.name} → {target.user.name}</p>
        </div>
        <div className="app-modal-body">
          <label className="app-label">Your message to {connector.user.name.split(" ")[0]}</label>
          <p style={{fontSize:"0.72rem",color:"var(--mid)",marginBottom:"0.5rem"}}>We've drafted a message. Feel free to edit it.</p>
          <textarea className="app-textarea" value={msg} onChange={e => setMsg(e.target.value)} rows={5} />
          <div className="app-modal-note">
            <strong>Note:</strong> This goes only to {connector.user.name.split(" ")[0]}. {target.user.name.split(" ")[0]} won't see anything unless they approve it.
          </div>
        </div>
        <div className="app-modal-foot">
          <button className="app-btn ghost" onClick={onClose}>Cancel</button>
          <button className="app-btn warm" onClick={send} disabled={status === "sending" || !msg.trim()}>
            {status === "sending" ? "Sending…" : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
