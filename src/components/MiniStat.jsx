import { motion } from "motion/react";
import AnimatedNumber from "./AnimatedNumber";
import "./MiniStat.css";

export default function MiniStat({ icon, value, numericValue, decimals = 0, unit, label, swatch }) {
  return (
    <motion.div
      className="mini-stat"
      whileHover={{ y: -3, borderColor: "var(--border-strong)" }}
      transition={{ duration: 0.15 }}
    >
      <div className="mini-stat__top">
        <span className="mini-stat__icon">{icon}</span>
        {swatch && <span className="mini-stat__swatch" style={{ background: swatch }} />}
      </div>
      {numericValue !== undefined ? (
        <div className="mini-stat__value">
          <AnimatedNumber value={numericValue} decimals={decimals} />
          {unit && <span className="mini-stat__unit">{unit}</span>}
        </div>
      ) : (
        value !== undefined && (
          <div className="mini-stat__value">
            {value}
            {unit && <span className="mini-stat__unit">{unit}</span>}
          </div>
        )
      )}
      <div className="mini-stat__label mono-label">{label}</div>
    </motion.div>
  );
}
