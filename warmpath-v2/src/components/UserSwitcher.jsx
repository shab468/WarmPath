import { useUser } from "../context/UserContext";
export default function UserSwitcher() {
  const { currentUser, setCurrentUser, allUsers } = useUser();
  return (
    <div className="app-switcher">
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <select value={currentUser.id} onChange={e => {
        const u = allUsers.find(u => u.id === parseInt(e.target.value));
        if (u) setCurrentUser(u);
      }}>
        {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
    </div>
  );
}
