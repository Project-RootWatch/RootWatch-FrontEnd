import { motion } from "motion/react";
import "./MetricChip.css";

export default function MetricChip({ level, value, label }) {
  return (
    <motion.div
      className={`metric-chip metric-chip--${level}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="metric-chip__value">{value}</div>
      <div className="metric-chip__label mono-label">{label}</div>
    </motion.div>
  );
}
