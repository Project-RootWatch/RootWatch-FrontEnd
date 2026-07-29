import "./MetricChip.css";

export default function MetricChip({ level, value, label }) {
  return (
    <div className={`metric-chip metric-chip--${level}`}>
      <div className="metric-chip__value">{value}</div>
      <div className="metric-chip__label mono-label">{label}</div>
    </div>
  );
}
