import { useEffect, useState } from "react";
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

export default function LogScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getActivity(20)
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <div className="log-screen">
      <div className="log-screen__header">
        <div className="log-screen__title">Activity Log</div>
        <div className="mono-label">Readings, irrigations, scans</div>
      </div>

      {events.length === 0 && <div className="mono-label log-screen__empty">No activity yet</div>}

      <div className="log-screen__list">
        {events.map((event, i) => {
          const Icon = ICONS[event.type] ?? ChartIcon;
          const color = COLORS[event.type] ?? "accent";
          return (
            <div className="log-item" key={`${event.type}-${event.timestamp}-${i}`}>
              <div className="log-item__rail">
                <div className={`log-item__dot log-item__dot--${color}`}>
                  <Icon width="14" height="14" />
                </div>
                {i < events.length - 1 && <div className="log-item__line" />}
              </div>
              <div className="log-item__content">
                <div className="log-item__label">{event.label}</div>
                <div className="mono-label">{formatRelativeTime(event.timestamp)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
