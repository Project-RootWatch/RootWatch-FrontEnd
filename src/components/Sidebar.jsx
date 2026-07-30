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
        <button
          key={id}
          className={`sidebar__item ${active === id ? "sidebar__item--active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon />
          <span className="mono-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
