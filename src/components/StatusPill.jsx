import "./StatusPill.css";

export default function StatusPill({ level, label }) {
  return (
    <span className={`status-pill status-pill--${level}`}>
      <span className="status-pill__dot" />
      {label}
    </span>
  );
}
