import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getNotificationsForUser, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "../data/mockData";

const icons = {
  intro_approved: (cls="ok") => <div className={`app-notif-icon ${cls}`}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>,
  intro_declined: (cls="no") => <div className={`app-notif-icon ${cls}`}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></div>,
  intro_request:  (cls="req") => <div className={`app-notif-icon ${cls}`}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>,
  contact_shared: (cls="contact") => <div className={`app-notif-icon ${cls}`}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>,
};

export default function NotificationBell() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setNotifs(getNotificationsForUser(currentUser.id).slice(0, 10));
    setUnread(getUnreadNotificationCount(currentUser.id));
  }, [currentUser.id, open]);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = n => {
    markNotificationRead(n.id);
    setUnread(p => Math.max(0, p - 1));
    setOpen(false);
    if (n.type === "intro_approved" && n.relatedRequestId) navigate(`/intro/${n.relatedRequestId}`);
    else if (n.type === "intro_request") navigate("/requests");
    else if (n.type === "contact_shared" && n.relatedRequestId) navigate(`/intro/${n.relatedRequestId}`);
    else navigate("/my-requests");
  };

  const fmt = ts => {
    const d = Date.now() - new Date(ts).getTime();
    const m = Math.floor(d/60000), h = Math.floor(d/3600000), dy = Math.floor(d/86400000);
    return m < 60 ? `${m}m ago` : h < 24 ? `${h}h ago` : `${dy}d ago`;
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="app-bell" onClick={() => setOpen(!open)}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {unread > 0 && <span className="app-bell-dot" />}
      </button>
      {open && (
        <div className="app-bell-menu">
          <div className="app-bell-head">
            <span>Notifications</span>
            {unread > 0 && <button className="app-btn ghost" style={{fontSize:"0.72rem",color:"var(--warm)"}} onClick={() => { markAllNotificationsRead(currentUser.id); setUnread(0); setNotifs(notifs.map(n=>({...n,read:true}))); }}>Mark all read</button>}
          </div>
          <div className="app-notif-list">
            {notifs.length === 0
              ? <div style={{padding:"1.25rem",textAlign:"center",fontSize:"0.8rem",color:"var(--mid)"}}>No notifications yet</div>
              : notifs.map(n => (
                  <button key={n.id} className={`app-notif ${!n.read?"unread":""}`} onClick={() => handleClick(n)}>
                    {(icons[n.type] || icons.intro_declined)()}
                    <div style={{flex:1,minWidth:0}}>
                      <div className="app-notif-text">{n.message}</div>
                      <div className="app-notif-time">{fmt(n.createdAt)}</div>
                    </div>
                    {!n.read && <div className="app-notif-dot" />}
                  </button>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
