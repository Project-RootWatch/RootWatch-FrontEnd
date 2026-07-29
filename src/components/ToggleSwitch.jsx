import "./ToggleSwitch.css";

export default function ToggleSwitch({ checked, disabled }) {
  return (
    <span className={`toggle-switch ${checked ? "toggle-switch--on" : ""} ${disabled ? "toggle-switch--disabled" : ""}`}>
      <span className="toggle-switch__knob" />
    </span>
  );
}
