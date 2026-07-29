import { useRef, useState } from "react";
import { DropletIcon } from "./icons";
import "./HoldToTrigger.css";

const HOLD_MS = 3000;
const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HoldToTrigger({ onComplete, disabled }) {
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  function tick(now) {
    const elapsed = now - startRef.current;
    const p = Math.min(1, elapsed / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      complete();
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function start() {
    if (disabled || busy) return;
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (!busy) setProgress(0);
  }

  function complete() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setBusy(true);
    Promise.resolve(onComplete()).finally(() => {
      setBusy(false);
      setProgress(0);
    });
  }

  return (
    <div className="hold-trigger">
      <button
        type="button"
        className="hold-trigger__button"
        disabled={disabled}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
      >
        <svg width="76" height="76" viewBox="0 0 76 76" className="hold-trigger__ring">
          <circle cx="38" cy="38" r={RADIUS} className="hold-trigger__ring-track" />
          <circle
            cx="38"
            cy="38"
            r={RADIUS}
            className="hold-trigger__ring-progress"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <span className="hold-trigger__icon">
          <DropletIcon />
        </span>
      </button>
      <div className="mono-label hold-trigger__label">{busy ? "Sending..." : "Hold"}</div>
    </div>
  );
}
