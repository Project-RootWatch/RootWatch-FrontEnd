import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { postAdvisory, postIrrigationTrigger, getIrrigationStatus } from "../api/client";
import Banner from "../components/Banner";
import ToggleSwitch from "../components/ToggleSwitch";
import HoldToTrigger from "../components/HoldToTrigger";
import StatusPill from "../components/StatusPill";
import Skeleton from "../components/Skeleton";
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
    <motion.div className="water-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="water-screen__header">
        <div>
          <div className="water-screen__title">Advisory</div>
          <div className="mono-label">Gemini AI · Sinhala / English</div>
        </div>
        <div className="water-screen__lang-toggle">
          <motion.button whileTap={{ scale: 0.92 }} className={lang === "si" ? "active" : ""} onClick={() => setLang("si")}>
            සිංහල
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }} className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </motion.button>
        </div>
      </div>

      {advisoryLoading && (
        <div className="water-screen__skeleton">
          <Skeleton height={62} radius="var(--radius-card)" />
        </div>
      )}
      {advisoryError && <div className="water-screen__error">{advisoryError}</div>}

      <AnimatePresence>
        {advisory && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.96 }}
        className="water-screen__refresh mono-label"
        onClick={loadAdvisory}
        disabled={advisoryLoading}
      >
        Refresh advisory
      </motion.button>

      <div className="water-screen__section-label mono-label">Irrigation control</div>

      <div className="water-screen__controls-grid">
        <div className="water-screen__controls-col">
          <motion.div className="water-screen__card" whileHover={{ y: -2, borderColor: "var(--border-strong)" }} transition={{ duration: 0.15 }}>
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
          </motion.div>

          <motion.div className="water-screen__card" whileHover={{ y: -2, borderColor: "var(--border-strong)" }} transition={{ duration: 0.15 }}>
            <div className="water-screen__card-row">
              <div>
                <div className="mono-label">Auto mode (LSTM)</div>
                <div className="water-screen__auto-note">Available once the LSTM model is integrated</div>
              </div>
              <ToggleSwitch checked={false} disabled />
            </div>
          </motion.div>
        </div>

        <div className="water-screen__manual">
          <div className="mono-label">Manual override</div>
          <div className="water-screen__manual-hint">Hold 3 seconds to trigger irrigation ({HOLD_TRIGGER_DURATION}s)</div>
          <HoldToTrigger onComplete={handleHoldComplete} />
          {triggerError && <div className="water-screen__error">{triggerError}</div>}
        </div>
      </div>
    </motion.div>
  );
}
