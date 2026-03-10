import { useState } from "react";
import { useUser } from "../context/UserContext";
import { getNetworkIntents, categories, getConnectionsForUser, getUserById } from "../data/mockData";

export default function ConnectorPrompt() {
  const { currentUser } = useUser();
  const intents = getNetworkIntents(currentUser.id);
  const [dismissed, setDismissed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  if (!intents.length || dismissed) return null;

  const intent = intents[0];
  const requester = getUserById(intent.userId);
  const cat = categories.find(c => c.id === intent.category);

  if (showForm) return <SuggestForm intent={intent} requester={requester} currentUser={currentUser} onClose={() => setShowForm(false)} />;

  return (
    <div className="app-banner">
      <span style={{fontSize:"1.4rem",lineHeight:1}}>{cat?.icon}</span>
      <div className="app-banner-body">
        <strong>Someone in your network needs help</strong>
        <p><strong style={{color:"var(--cream)"}}>{requester.name}</strong> is looking for help with <strong style={{color:"var(--cream)"}}>{cat?.label.toLowerCase()}</strong>{intent.description && `: "${intent.description}"`}</p>
        <div className="app-banner-actions">
          <button className="app-btn warm" style={{fontSize:"0.76rem",padding:"0.45rem 1rem"}} onClick={() => setShowForm(true)}>I know someone →</button>
          <button className="app-btn ghost" style={{color:"rgba(242,233,228,0.5)"}} onClick={() => setDismissed(true)}>Not now</button>
        </div>
      </div>
      <button className="app-banner-dismiss" onClick={() => setDismissed(true)}>×</button>
    </div>
  );
}

function SuggestForm({ intent, requester, currentUser, onClose }) {
  const [person, setPerson] = useState("");
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const conns = getConnectionsForUser(currentUser.id).map(c => {
    const id = c.userA === currentUser.id ? c.userB : c.userA;
    return getUserById(id);
  }).filter(u => u && u.id !== requester.id);

  if (done) return (
    <div className="app-suggest" style={{background:"#e8f5e0",border:"1px solid #c3e6a8",textAlign:"center"}}>
      <p style={{fontWeight:500,color:"var(--dark)",marginBottom:"0.4rem"}}>Thanks for connecting people!</p>
      <p style={{fontSize:"0.82rem",color:"var(--mid)",marginBottom:"0.875rem"}}>Your suggestion has been sent.</p>
      <button className="app-btn outline" style={{fontSize:"0.76rem",padding:"0.45rem 1rem"}} onClick={onClose}>Done</button>
    </div>
  );

  return (
    <div className="app-suggest">
      <div className="app-suggest-head">
        <h3>Suggest a connection for {requester.name.split(" ")[0]}</h3>
        <button className="app-banner-dismiss" style={{color:"var(--mid)"}} onClick={onClose}>×</button>
      </div>
      <div className="app-field">
        <label className="app-label">Who should they meet?</label>
        <select className="app-select" value={person} onChange={e => setPerson(e.target.value)} required>
          <option value="">Select someone…</option>
          {conns.map(p => <option key={p.id} value={p.id}>{p.name} ({p.major})</option>)}
        </select>
      </div>
      <div className="app-field">
        <label className="app-label">Why should they meet?</label>
        <input className="app-input" type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., They both worked on similar research…" required />
      </div>
      <div style={{display:"flex",gap:"0.75rem"}}>
        <button className="app-btn ghost" onClick={onClose}>Cancel</button>
        <button className="app-btn warm" style={{fontSize:"0.8rem"}} onClick={() => person && reason && setDone(true)}>Send Suggestion</button>
      </div>
    </div>
  );
}
