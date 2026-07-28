import "./StatusBadge.css";

const ICONS = {
  good: (
    <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  warning: (
    <path
      d="M10 3l8 14H2L10 3z M10 8v4 M10 14.5v.01"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  serious: (
    <>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 6v5 M10 13.5v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  critical: (
    <path d="M6 6l8 8 M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  ),
};

export default function StatusBadge({ level, label }) {
  return (
    <span className={`status-badge status-badge--${level}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        {ICONS[level] ?? ICONS.good}
      </svg>
      {label}
    </span>
  );
}
