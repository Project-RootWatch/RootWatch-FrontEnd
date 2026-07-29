import { SoilIcon, ChartIcon, LeafIcon, DropletIcon, ClockIcon } from "./icons";
import "./BottomNav.css";

const TABS = [
  { id: "soil", label: "Soil", Icon: SoilIcon },
  { id: "chart", label: "Chart", Icon: ChartIcon },
  { id: "plant", label: "Plant", Icon: LeafIcon },
  { id: "water", label: "Water", Icon: DropletIcon },
  { id: "log", label: "Log", Icon: ClockIcon },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`bottom-nav__item ${active === id ? "bottom-nav__item--active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon />
          <span className="mono-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
