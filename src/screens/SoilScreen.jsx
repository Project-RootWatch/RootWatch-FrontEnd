import MoistureVessel from "../components/MoistureVessel";
import StatusPill from "../components/StatusPill";
import MiniStat from "../components/MiniStat";
import Banner from "../components/Banner";
import { ThermometerIcon, SunIcon, LeafIcon, WarningIcon } from "../components/icons";
import { formatRelativeTime } from "../time";
import "./SoilScreen.css";

function leafColorLabel(color) {
  const { r, g, b } = color;
  if (g > r && g > b) return "Healthy green";
  if (r > g && r > b) return "Reddish - check stress";
  return "Mixed tone";
}

export default function SoilScreen({ current, status }) {
  if (!current) {
    return <div className="soil-screen__empty mono-label">Waiting for the first sensor reading...</div>;
  }

  const swatch = `rgb(${current.color.r}, ${current.color.g}, ${current.color.b})`;

  return (
    <div className="soil-screen">
      {status.level !== "good" && (
        <Banner
          level={status.level}
          icon={<WarningIcon />}
          title={status.label}
          subtitle="Threshold check · LSTM forecast lands in a later step"
        />
      )}

      <div className="soil-screen__hero">
        <MoistureVessel value={current.soil_moisture} />
        <div className="soil-screen__hero-value">
          {Math.round(current.soil_moisture)}
          <span className="soil-screen__hero-unit">%</span>
        </div>
        <div className="mono-label">Soil moisture</div>
        <div className="soil-screen__hero-pill">
          <StatusPill level={status.level} label={status.level === "good" ? "Normal" : "Caution"} />
        </div>
      </div>

      <div className="soil-screen__stats">
        <MiniStat icon={<ThermometerIcon />} value={current.temperature} unit="°C" label="Temp" />
        <MiniStat icon={<SunIcon />} value={Math.round(current.light_level)} unit="%" label="Light" />
        <MiniStat icon={<LeafIcon />} swatch={swatch} label={leafColorLabel(current.color)} />
      </div>

      <div className="soil-screen__footer mono-label">
        <span className="soil-screen__live-dot" /> Live · Updated {formatRelativeTime(current.timestamp)} · ESP32-C6
        Field Unit #1
      </div>
    </div>
  );
}
