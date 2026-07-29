import { useEffect, useState } from "react";
import { postAdvisory, postIrrigationTrigger, getIrrigationStatus } from "../api/client";
import Banner from "../components/Banner";
import ToggleSwitch from "../components/ToggleSwitch";
import HoldToTrigger from "../components/HoldToTrigger";
import StatusPill from "../components/StatusPill";
import { WarningIcon, CheckCircleIcon, DropletIcon } from "../components/icons";
import { formatRelativeTime } from "../time";
import "./WaterScreen.css";

const STATUS_POLL_MS = 10000;
const HOLD_TRIGGER_DURATION = 30;

export default function WaterScreen() {
  const [lang, setLang] = useState("si");
  const [advisory, setAdvisory] = useState(null);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const [advisoryError, setAdvisoryError] = useState(null);
  const [lastCommand, setLastCommand] = useState(null);
  const [triggerError, setTriggerError] = useState(null);

  function loadAdvisory() {
    setAdvisoryLoading(true);
    setAdvisoryError(null);
    postAdvisory()
      .then(setAdvisory)
      .catch((err) => setAdvisoryError(err.message))
      .finally(() => setAdvisoryLoading(false));
  }

  useEffect(() => {
    loadAdvisory();
  }, []);

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

  function handleHoldComplete() {
    setTriggerError(null);
    return postIrrigationTrigger(HOLD_TRIGGER_DURATION)
      .then(setLastCommand)
      .catch((err) => setTriggerError(err.message));
  }

  return (
    <div className="water-screen">
      <div className="water-screen__header">
        <div>
          <div className="water-screen__title">Advisory</div>
          <div className="mono-label">Gemini AI · Sinhala / English</div>
        </div>
        <div className="water-screen__lang-toggle">
          <button className={lang === "si" ? "active" : ""} onClick={() => setLang("si")}>
            සිංහල
          </button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
      </div>

      {advisoryLoading && <div className="mono-label water-screen__loading">Loading advisory...</div>}
      {advisoryError && <div className="water-screen__error">{advisoryError}</div>}

      {advisory && (
        <Banner
          level={advisory.status.level}
          icon={advisory.status.level === "good" ? <CheckCircleIcon /> : <WarningIcon />}
          title={advisory.status.level === "good" ? advisory.status.label : "Action required"}
          subtitle={
            <span className={lang === "si" ? "sinhala" : ""}>
              {lang === "si" ? advisory.advisory.sinhala : advisory.advisory.english}
            </span>
          }
        />
      )}

      <button className="water-screen__refresh mono-label" onClick={loadAdvisory} disabled={advisoryLoading}>
        Refresh advisory
      </button>

      <div className="water-screen__section-label mono-label">Irrigation control</div>

      <div className="water-screen__card">
        <div className="water-screen__card-row">
          <div>
            <div className="mono-label">Last command</div>
            {lastCommand ? (
              <>
                <div className="water-screen__valve-state">
                  <StatusPill level={lastCommand.picked_up ? "good" : "warning"} label={lastCommand.picked_up ? "Sent to device" : "Waiting for device"} />
                </div>
                <div className="mono-label water-screen__valve-meta">
                  {formatRelativeTime(lastCommand.requested_at)} · {lastCommand.duration_seconds}s
                </div>
              </>
            ) : (
              <div className="water-screen__valve-state mono-label">No commands sent yet</div>
            )}
          </div>
          <DropletIcon />
        </div>
      </div>

      <div className="water-screen__card">
        <div className="water-screen__card-row">
          <div>
            <div className="mono-label">Auto mode (LSTM)</div>
            <div className="water-screen__auto-note">Available once the LSTM model is integrated</div>
          </div>
          <ToggleSwitch checked={false} disabled />
        </div>
      </div>

      <div className="water-screen__manual">
        <div className="mono-label">Manual override</div>
        <div className="water-screen__manual-hint">Hold 3 seconds to trigger irrigation ({HOLD_TRIGGER_DURATION}s)</div>
        <HoldToTrigger onComplete={handleHoldComplete} />
        {triggerError && <div className="water-screen__error">{triggerError}</div>}
      </div>
    </div>
  );
}
