import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/mockData";
import ConnectorPrompt from "../components/ConnectorPrompt";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  return (
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <ConnectorPrompt />
      <div className="app-eyebrow">Declare your intent</div>
      <h1 className="app-page-title">What are you looking<br/>for help with?</h1>
      <p className="app-page-sub">Select a category and we'll map paths to people who can help.</p>

      <form onSubmit={e => { e.preventDefault(); if (selected) navigate("/paths", { state: { category: selected, description: desc.trim() } }); }}>
        <div className="app-cat-grid">
          {categories.map(c => (
            <button key={c.id} type="button" className={`app-cat-btn ${selected === c.id ? "on" : ""}`} onClick={() => setSelected(c.id)}>
              <span className="app-cat-icon">{c.icon}</span>
              <span className="app-cat-label">{c.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="app-field">
            <label className="app-label">Tell us more (optional)</label>
            <textarea className="app-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g., Looking for advice on consulting recruiting for sophomore internships…" rows={3} />
          </div>
        )}

        <button type="submit" className="app-btn warm full" disabled={!selected}>
          Find paths →
        </button>
      </form>
    </div>
  );
}
