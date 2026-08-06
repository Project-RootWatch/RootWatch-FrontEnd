import { motion, AnimatePresence } from "motion/react";
import MoistureVessel from "../components/MoistureVessel";
import StatusPill from "../components/StatusPill";
import MiniStat from "../components/MiniStat";
import Banner from "../components/Banner";
import AnimatedNumber from "../components/AnimatedNumber";
import { ThermometerIcon, SunIcon, LeafIcon, WarningIcon } from "../components/icons";
import { formatRelativeTime } from "../time";
import "./SoilScreen.css";

function leafColorLabel(color) {
  const { r, g, b } = color;
  if (g > r && g > b) return "Healthy green";
  if (r > g && r > b) return "Reddish - check stress";
  return "Mixed tone";
}

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function SoilScreen({ current, status }) {
  if (!current) {
    return <div className="soil-screen__empty mono-label">Waiting for the first sensor reading...</div>;
  }

  const swatch = current.color ? `rgb(${current.color.r}, ${current.color.g}, ${current.color.b})` : undefined;
  const leafLabel = current.color ? leafColorLabel(current.color) : "Color sensor not connected";

  return (
    <motion.div className="soil-screen" variants={container} initial="initial" animate="animate">
      <AnimatePresence>
        {status.level !== "good" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Banner
              level={status.level}
              icon={<WarningIcon />}
              title={status.label}
              subtitle="Threshold check · LSTM forecast lands in a later step"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="soil-screen__grid">
        <motion.div className="soil-screen__hero" variants={item}>
          <MoistureVessel value={current.soil_moisture} />
          <div className="soil-screen__hero-value">
            <AnimatedNumber value={Math.round(current.soil_moisture)} />
            <span className="soil-screen__hero-unit">%</span>
          </div>
          <div className="mono-label">Soil moisture</div>
          <div className="soil-screen__hero-pill">
            <StatusPill level={status.level} label={status.level === "good" ? "Normal" : "Caution"} />
          </div>
        </motion.div>

        <motion.div className="soil-screen__stats" variants={item}>
          <MiniStat icon={<ThermometerIcon />} numericValue={current.temperature} decimals={1} unit="°C" label="Temp" />
          <MiniStat icon={<SunIcon />} numericValue={Math.round(current.light_level)} unit="%" label="Light" />
          <MiniStat icon={<LeafIcon />} swatch={swatch} label={leafLabel} />
        </motion.div>
      </div>

      <motion.div className="soil-screen__footer mono-label" variants={item}>
        <motion.span
          className="soil-screen__live-dot"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        Live · Updated {formatRelativeTime(current.timestamp)} · ESP32-C6 Field Unit #1
      </motion.div>
    </motion.div>
  );
}
