import { useParams, Link, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { introRequests, getUserById, generateContextPreRead } from "../data/mockData";
import ContactExchange from "../components/ContactExchange";

export default function IntroOutcome() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const req = introRequests.find(r => r.id === parseInt(id));
  if (!req || req.status !== "approved") return <Navigate to="/home" replace />;

  const isInvolved = currentUser.id === req.requesterId || currentUser.id === req.targetId;
  const requester = getUserById(req.requesterId);
  const target = getUserById(req.targetId);
  const connector = getUserById(req.connectorId);
  const ctx = generateContextPreRead(requester, target);
  const initials = n => `${n.split(" ")[0][0]}${n.split(" ").pop()[0]}`;

  return (
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div className="app-outcome-head">
        <div className="app-outcome-icon">
          <svg width="24" height="24" fill="none" stroke="var(--mid)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1>Introduction Made</h1>
        <p>{connector.name.split(" ")[0]} connected {requester.name.split(" ")[0]} and {target.name.split(" ")[0]}</p>
      </div>

      <div className="app-card">
        <div className="app-intro-msg-label">Introduction Message</div>
        <p style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--dark)"}}>{req.message}</p>
      </div>

      <div className="app-preread-grid">
        {[{ person: ctx.person1, cls: "you" }, { person: ctx.person2, cls: "target" }].map(({ person, cls }) => (
          <div key={cls} className="app-card" style={{marginBottom:0}}>
            <div className="app-preread-person">
              <div className={`app-avatar sm ${cls}`}>{initials(person.name)}</div>
              <div className="app-preread-name">{person.name}</div>
            </div>
            <ul style={{listStyle:"none"}}>
              {person.bullets.map((b, i) => (
                <li key={i} className="app-preread-bullet">
                  <div className={`app-bullet ${cls}`}/>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{marginTop:"0.875rem"}}>
        {isInvolved
          ? <ContactExchange request={req} />
          : <div className="app-contact-box">
              <h2>Introduction Sent</h2>
              <p>Both {requester.name.split(" ")[0]} and {target.name.split(" ")[0]} have been notified and can connect directly.</p>
            </div>
        }
      </div>

      <div style={{textAlign:"center",marginTop:"1.5rem"}}>
        <Link to="/home" className="app-back">← Back to Home</Link>
      </div>
    </div>
  );
}
