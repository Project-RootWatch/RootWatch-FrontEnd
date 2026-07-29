import "./Banner.css";

export default function Banner({ level, icon, title, subtitle }) {
  return (
    <div className={`banner banner--${level}`}>
      <span className="banner__icon">{icon}</span>
      <div>
        <div className="banner__title">{title}</div>
        {subtitle && <div className="banner__subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
