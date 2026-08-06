import { motion } from "motion/react";
import { SoilIcon, ChartIcon, LeafIcon, DropletIcon, ClockIcon } from "./icons";
import "./Sidebar.css";

const TABS = [
  { id: "soil", label: "Soil", Icon: SoilIcon },
  { id: "chart", label: "Chart", Icon: ChartIcon },
  { id: "plant", label: "Plant", Icon: LeafIcon },
  { id: "water", label: "Water", Icon: DropletIcon },
  { id: "log", label: "Log", Icon: ClockIcon },
];

export default function Sidebar({ active, onChange }) {
  return (
    <nav className="sidebar">
      {TABS.map(({ id, label, Icon }) => (
        <motion.button
          key={id}
          className={`sidebar__item ${active === id ? "sidebar__item--active" : ""}`}
          onClick={() => onChange(id)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.94 }}
        >
          {active === id && (
            <motion.div
              layoutId="sidebar-active"
              className="sidebar__active-bg"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="sidebar__item-content">
            <Icon />
            <span className="mono-label">{label}</span>
          </span>
        </motion.button>
      ))}
    </nav>
  );
}
