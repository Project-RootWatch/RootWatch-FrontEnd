import "./MoistureVessel.css";

const VESSEL_TOP = 20;
const VESSEL_BOTTOM = 150;
const VESSEL_HEIGHT = VESSEL_BOTTOM - VESSEL_TOP;

export default function MoistureVessel({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  const fillY = VESSEL_BOTTOM - (clamped / 100) * VESSEL_HEIGHT;

  return (
    <svg className="moisture-vessel" width="120" height="170" viewBox="0 0 120 170">
      {/* sprout */}
      <path
        d="M60 4c-8 6-8 14 0 20 8-6 8-14 0-20z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="60" y1="20" x2="60" y2="24" stroke="var(--accent)" strokeWidth="2" />

      {/* vessel outline */}
      <rect
        x="28"
        y={VESSEL_TOP}
        width="64"
        height={VESSEL_HEIGHT}
        rx="10"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />

      {/* fill */}
      <clipPath id="vessel-clip">
        <rect x="28" y={VESSEL_TOP} width="64" height={VESSEL_HEIGHT} rx="10" />
      </clipPath>
      <rect
        x="28"
        y={fillY}
        width="64"
        height={VESSEL_BOTTOM - fillY}
        fill="var(--accent-soft)"
        clipPath="url(#vessel-clip)"
      />
      <path d={`M28 ${fillY}L92 ${fillY}`} stroke="var(--accent)" strokeWidth="1.5" />

      {/* fill level dots texture */}
      {Array.from({ length: 4 }).map((_, col) =>
        Array.from({ length: 6 }).map((_, row) => {
          const cx = 38 + col * 15;
          const cy = fillY + 10 + row * 18;
          if (cy > VESSEL_BOTTOM - 8) return null;
          return <circle key={`${col}-${row}`} cx={cx} cy={cy} r="1" fill="var(--accent)" opacity="0.35" />;
        })
      )}

      <text x="98" y={fillY + 4} className="moisture-vessel__label">
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}
