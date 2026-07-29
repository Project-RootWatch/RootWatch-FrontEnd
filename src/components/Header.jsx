import StatusPill from "./StatusPill";
import "./Header.css";

export default function Header({ status }) {
  return (
    <header className="app-header">
      <div>
        <div className="app-header__brand">RootWatch</div>
        <div className="app-header__meta mono-label">Tomato · Plot A · Field Unit #1</div>
      </div>
      <StatusPill level={status.level} label={status.label} />
    </header>
  );
}
