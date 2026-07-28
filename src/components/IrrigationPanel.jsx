import { useEffect, useState } from "react";
import { getIrrigationStatus, postIrrigationTrigger } from "../api/client";
import StatusBadge from "./StatusBadge";
import "./IrrigationPanel.css";

const STATUS_POLL_MS = 10000;
const DEFAULT_DURATION = 30;

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function IrrigationPanel() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [confirming, setConfirming] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function loadStatus() {
      getIrrigationStatus()
        .then((data) => !cancelled && setLastCommand(data.last_command))
        .catch(() => {});
    }

    loadStatus();
    const interval = setInterval(loadStatus, STATUS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function handleTriggerClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setTriggering(true);
    setError(null);
    postIrrigationTrigger(duration)
      .then((command) => {
        setLastCommand(command);
        setConfirming(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setTriggering(false));
  }

  return (
    <div className="irrigation-panel">
      <div className="irrigation-panel__title">Irrigation</div>

      <div className="irrigation-panel__status">
        {lastCommand ? (
          <>
            Last triggered at {formatTime(lastCommand.requested_at)} for {lastCommand.duration_seconds}s
            {" — "}
            <StatusBadge
              level={lastCommand.picked_up ? "good" : "warning"}
              label={lastCommand.picked_up ? "Picked up by device" : "Waiting for device"}
            />
          </>
        ) : (
          "No irrigation triggered yet."
        )}
      </div>

      {error && <div className="irrigation-panel__error">{error}</div>}

      <div className="irrigation-panel__controls">
        <label className="irrigation-panel__duration-label">
          Duration (seconds)
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="irrigation-panel__duration-input"
            disabled={confirming}
          />
        </label>

        <button
          className={`irrigation-panel__trigger-button ${confirming ? "irrigation-panel__trigger-button--confirm" : ""}`}
          onClick={handleTriggerClick}
          disabled={triggering}
        >
          {triggering ? "Sending..." : confirming ? "Confirm irrigation?" : "Trigger irrigation"}
        </button>

        {confirming && !triggering && (
          <button className="irrigation-panel__cancel-button" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
