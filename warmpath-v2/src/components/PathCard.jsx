export default function PathCard({ currentUser, connector, target, onRequestIntro }) {
  const initials = n => `${n.split(" ")[0][0]}${n.split(" ").pop()[0]}`;
  const warmthScore = (w) => {
    const map = { "close friends": 4, "good friends": 4, "teammates": 3, "classmates": 3, "acquaintances": 2, "met once": 1 };
    return map[w?.toLowerCase()] || 2;
  };
  const score1 = warmthScore(connector.warmth);
  const score2 = warmthScore(target.warmth);

  return (
    <div className="app-card">
      <div className="app-chain">
        <div className="app-chain-node">
          <div className="app-dot you">You</div>
          <div className="app-node-body">
            <div className="app-node-name">You</div>
            <div className="app-node-ctx">{currentUser.major}</div>
            <span className="app-node-tag warm-tag">Starting point</span>
          </div>
        </div>
        <div className="app-chain-node">
          <div className="app-dot conn">{initials(connector.user.name)}</div>
          <div className="app-node-body">
            <div className="app-node-name">{connector.user.name}</div>
            <div className="app-node-ctx">{connector.context} · {connector.user.major}</div>
            <span className="app-node-tag">Connector</span>
          </div>
        </div>
        <div className="app-chain-node">
          <div className="app-dot target">{initials(target.user.name)}</div>
          <div className="app-node-body" style={{paddingBottom:0}}>
            <div className="app-node-name">{target.user.name}</div>
            <div className="app-node-ctx">{target.context} · {target.user.major}</div>
            <span className="app-node-tag">Target</span>
          </div>
        </div>
      </div>

      <div className="app-card-footer">
        <div style={{display:"flex",gap:"1.25rem",alignItems:"center"}}>
          <div className="app-warmth">
            <span>Path warmth</span>
            <div className="app-warmth-dots">
              {[1,2,3,4].map(i => <span key={i} className={i <= Math.round((score1+score2)/2) ? "on" : ""} />)}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.76rem",color:"var(--mid)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:connector.openToIntros?"var(--mid)":"var(--border)",display:"inline-block"}} />
            {connector.openToIntros ? "Open to intros" : "Not available"}
          </div>
        </div>
        <button className="app-btn warm" onClick={onRequestIntro} disabled={!connector.openToIntros}>
          Request Intro
        </button>
      </div>
    </div>
  );
}
