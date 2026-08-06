import { motion } from "motion/react";
import "./StatusPill.css";

export default function StatusPill({ level, label }) {
  const urgent = level === "warning" || level === "serious" || level === "critical";

  return (
    <motion.span
      className={`status-pill status-pill--${level}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <motion.span
        className="status-pill__dot"
        animate={urgent ? { opacity: [1, 0.35, 1] } : {}}
        transition={urgent ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : {}}
      />
      {label}
    </motion.span>
  );
}
