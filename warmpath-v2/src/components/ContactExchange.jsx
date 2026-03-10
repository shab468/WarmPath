import { useState } from "react";
import { useUser } from "../context/UserContext";
import { userDetails, getUserById, markContactShared, addNotification } from "../data/mockData";

export default function ContactExchange({ request }) {
  const { currentUser } = useUser();
  const [shared, setShared] = useState(request.contactShared);
  const isReq = currentUser.id === request.requesterId;
  const isTgt = currentUser.id === request.targetId;
  if (!isReq && !isTgt) return null;

  const other = getUserById(isReq ? request.targetId : request.requesterId);
  const otherDetails = userDetails[isReq ? request.targetId : request.requesterId];
  const myDetails = userDetails[currentUser.id];
  const initials = n => `${n.split(" ")[0][0]}${n.split(" ").pop()[0]}`;

  const handleShare = () => {
    markContactShared(request.id);
    setShared(true);
    addNotification({ userId: other.id, type: "contact_shared", message: `${currentUser.name.replace(" (Jordan)", "")} shared their contact info with you`, relatedRequestId: request.id });
  };

  return (
    <div className="app-contact-box">
      <h2>Connect with {other.name.split(" ")[0]}</h2>
      {!shared ? (
        <>
          <p>Ready to connect? Share your contact info to get in touch directly.</p>
          <button className="app-btn" style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)"}} onClick={handleShare}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Share Contact Info
          </button>
        </>
      ) : (
        <>
          <p>Contact info shared! 🎊</p>
          <div className="app-contact-cards">
            <div className="app-contact-card">
              <div className="app-avatar sm you">{initials(currentUser.name)}</div>
              <div><div className="app-contact-name">Your contact</div><div className="app-contact-email">{myDetails?.contactEmail}</div></div>
            </div>
            <div className="app-contact-card">
              <div className="app-avatar sm target">{initials(other.name)}</div>
              <div><div className="app-contact-name">{other.name}</div><div className="app-contact-email">{otherDetails?.contactEmail}</div></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
