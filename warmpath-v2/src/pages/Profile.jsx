import { useUser } from "../context/UserContext";
import { userDetails, getDirectConnectionsCount } from "../data/mockData";

export default function Profile() {
  const { currentUser } = useUser();
  const details = userDetails[currentUser.id];
  const count = getDirectConnectionsCount(currentUser.id);
  const initials = `${currentUser.name.split(" ")[0][0]}${currentUser.name.split(" ").slice(-1)[0][0]}`;

  return (
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div className="app-profile-hero">
        <div className="app-avatar">{initials}</div>
        <div>
          <div className="app-profile-name">{currentUser.name.replace(" (Jordan)", "")}</div>
          <div className="app-profile-sub">{currentUser.year} · {currentUser.major}</div>
          {details?.contactEmail && <div style={{fontSize:"0.78rem",color:"rgba(242,233,228,0.5)",marginTop:"0.2rem"}}>{details.contactEmail}</div>}
        </div>
      </div>

      <div className="app-card">
        <div className="app-section-title">Your Network</div>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"#e8f5e0",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="22" height="22" fill="none" stroke="var(--mid)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",color:"var(--dark)"}}>{count}</div>
            <div style={{fontSize:"0.78rem",color:"var(--mid)"}}>direct connections</div>
          </div>
        </div>
        <p style={{fontSize:"0.8rem",color:"var(--mid)",marginTop:"1rem",lineHeight:1.6}}>Your connections can introduce you to people in their network.</p>
      </div>

      {details?.experiences?.length > 0 && (
        <div className="app-card">
          <div className="app-section-title">Experiences</div>
          <ul className="app-exp-list">
            {details.experiences.map((e, i) => (
              <li key={i} className="app-exp-item"><div className="app-exp-dot"/><span>{e}</span></li>
            ))}
          </ul>
        </div>
      )}

      {details?.interests?.length > 0 && (
        <div className="app-card">
          <div className="app-section-title">Interests</div>
          <div className="app-interest-tags">
            {details.interests.map((t, i) => <span key={i} className="app-interest-tag">{t}</span>)}
          </div>
        </div>
      )}

      <p style={{textAlign:"center",fontSize:"0.76rem",color:"var(--mid)",marginTop:"1.5rem"}}>This is how others see you when you're suggested as a connection.</p>
    </div>
  );
}
