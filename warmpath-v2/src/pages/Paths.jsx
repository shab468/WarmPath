import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { findPaths, categories } from "../data/mockData";
import PathCard from "../components/PathCard";
import IntroRequestModal from "../components/IntroRequestModal";

export default function Paths() {
  const location = useLocation();
  const { currentUser } = useUser();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!location.state?.category) return <Navigate to="/home" replace />;
  const { category, description } = location.state;
  const cat = categories.find(c => c.id === category);
  const paths = findPaths(currentUser.id, category);

  return (
    <div>
      <Link to="/home" className="app-back">← Change search</Link>
      <div className="app-eyebrow">Path discovery</div>
      <h1 className="app-page-title">{cat?.icon} <em>{cat?.label}</em></h1>
      {description && <p className="app-page-sub">"{description}"</p>}

      {paths.length > 0
        ? paths.map((p, i) => <PathCard key={i} currentUser={currentUser} connector={p.connector} target={p.target} onRequestIntro={() => { setSelected(p); setShowModal(true); }} />)
        : <div className="app-empty">
            <h2>No paths found</h2>
            <p>Try a different category or check back as your network grows.</p>
            <Link to="/home" className="app-btn warm">Try another search</Link>
          </div>
      }

      {showModal && selected && (
        <IntroRequestModal currentUser={currentUser} connector={selected.connector} target={selected.target} intent={{ category, description }} onClose={() => { setShowModal(false); setSelected(null); }} />
      )}
    </div>
  );
}
