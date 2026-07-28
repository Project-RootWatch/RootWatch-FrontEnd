import { useState } from "react";
import { postAdvisory } from "../api/client";
import StatusBadge from "./StatusBadge";
import "./AdvisoryPanel.css";

export default function AdvisoryPanel() {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleClick() {
    setLoading(true);
    setError(null);
    postAdvisory()
      .then(setAdvisory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="advisory-panel">
      <div className="advisory-panel__header">
        <div className="advisory-panel__title">Advisory</div>
        <button className="advisory-panel__button" onClick={handleClick} disabled={loading}>
          {loading ? "Thinking..." : advisory ? "Refresh" : "Get advisory"}
        </button>
      </div>

      {error && <div className="advisory-panel__error">{error}</div>}

      {advisory && (
        <div className="advisory-panel__result">
          <StatusBadge level={advisory.status.level} label={advisory.status.label} />
          <p className="advisory-panel__text">{advisory.advisory_text}</p>
        </div>
      )}

      {!advisory && !error && !loading && (
        <div className="advisory-panel__placeholder">
          Get a plain-language, Sinhala recommendation based on the latest reading.
        </div>
      )}
    </div>
  );
}
