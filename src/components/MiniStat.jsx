import "./MiniStat.css";

export default function MiniStat({ icon, value, unit, label, swatch }) {
  return (
    <div className="mini-stat">
      <div className="mini-stat__top">
        <span className="mini-stat__icon">{icon}</span>
        {swatch && <span className="mini-stat__swatch" style={{ background: swatch }} />}
      </div>
      {value !== undefined && (
        <div className="mini-stat__value">
          {value}
          {unit && <span className="mini-stat__unit">{unit}</span>}
        </div>
      )}
      <div className="mini-stat__label mono-label">{label}</div>
    </div>
  );
}
