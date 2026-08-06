import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getActivity } from "../api/client";
import { ChartIcon, DropletIcon, LeafIcon } from "../components/icons";
import { formatRelativeTime } from "../time";
import "./LogScreen.css";

const ICONS = {
  reading: ChartIcon,
  irrigation: DropletIcon,
  plant_scan: LeafIcon,
};

const COLORS = {
  reading: "accent",
  irrigation: "good",
  plant_scan: "good",
};

const container = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const item = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
};

export default function LogScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getActivity(20)
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <div className="log-screen">
      <motion.div className="log-screen__header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="log-screen__title">Activity Log</div>
        <div className="mono-label">Readings, irrigations, scans</div>
      </motion.div>

      {events.length === 0 && <div className="mono-label log-screen__empty">No activity yet</div>}

      <motion.div className="log-screen__list" variants={container} initial="initial" animate="animate">
        {events.map((event, i) => {
          const Icon = ICONS[event.type] ?? ChartIcon;
          const color = COLORS[event.type] ?? "accent";
          return (
            <motion.div className="log-item" key={`${event.type}-${event.timestamp}-${i}`} variants={item}>
              <div className="log-item__rail">
                <motion.div
                  className={`log-item__dot log-item__dot--${color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04 + 0.1, type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon width="14" height="14" />
                </motion.div>
                {i < events.length - 1 && <div className="log-item__line" />}
              </div>
              <div className="log-item__content">
                <div className="log-item__label">{event.label}</div>
                <div className="mono-label">{formatRelativeTime(event.timestamp)}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
