import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { postPlantHealth, getPlantHealthHistory } from "../api/client";
import StatusPill from "../components/StatusPill";
import MetricChip from "../components/MetricChip";
import Skeleton from "../components/Skeleton";
import { CameraIcon, CheckCircleIcon, LeafIcon } from "../components/icons";
import { diseaseLevel, stressLevel, growthLevel, overallScanLevel, capitalize } from "../plantHealth";
import { formatRelativeTime } from "../time";
import "./PlantScreen.css";

export default function PlantScreen() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scan, setScan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlantHealthHistory(6)
      .then(setHistory)
      .catch(() => {});
  }, [scan]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(event) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setScan(null);
    setError(null);
    if (selected) handleAnalyze(selected);
  }

  function handleAnalyze(selectedFile) {
    setLoading(true);
    setError(null);
    postPlantHealth(selectedFile)
      .then(setScan)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <motion.div className="plant-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="plant-screen__header">
        <div className="plant-screen__title">Plant Health</div>
        <div className="mono-label">Gemini Vision analysis</div>
      </div>

      <div className="plant-screen__grid">
        <motion.div
          className="plant-screen__photo-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {scan && (
              <motion.div
                className="plant-screen__photo-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatusPill level={overallScanLevel(scan)} label={capitalize(overallScanLevel(scan))} />
              </motion.div>
            )}
          </AnimatePresence>

          {previewUrl ? (
            <motion.img
              key={previewUrl}
              src={previewUrl}
              alt="Selected leaf"
              className="plant-screen__photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <label className="plant-screen__upload-placeholder">
              <CameraIcon />
              <span className="mono-label">Click to upload a leaf photo</span>
            </label>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleFileChange}
            id="plant-photo-input"
            className="plant-screen__file-input"
          />
          <motion.label
            htmlFor="plant-photo-input"
            className="plant-screen__choose-button"
            whileHover={{ backgroundColor: "var(--surface-2)" }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Analyzing..." : file ? "Choose a different photo" : "Choose photo"}
          </motion.label>
        </motion.div>

        <motion.div
          className="plant-screen__result-pane"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {error && <div className="plant-screen__error">{error}</div>}

          {loading && !scan && (
            <div className="plant-screen__skeleton">
              <Skeleton height={18} width="60%" />
              <Skeleton height={14} style={{ marginTop: 10 }} />
              <Skeleton height={14} width="85%" style={{ marginTop: 8 }} />
              <div className="plant-screen__skeleton-chips">
                <Skeleton height={54} />
                <Skeleton height={54} />
                <Skeleton height={54} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {scan && !loading ? (
              <motion.div
                key={scan.id}
                className="plant-screen__result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="plant-screen__result-headline">
                  <CheckCircleIcon />
                  <span className="sinhala">{scan.headline}</span>
                </div>
                <p className="plant-screen__result-description sinhala">{scan.description}</p>

                <div className="plant-screen__chips">
                  <MetricChip level={diseaseLevel(scan.disease)} value={capitalize(scan.disease)} label="Disease" />
                  <MetricChip level={stressLevel(scan.stress)} value={capitalize(scan.stress)} label="Stress" />
                  <MetricChip level={growthLevel(scan.growth)} value={capitalize(scan.growth)} label="Growth" />
                </div>
              </motion.div>
            ) : (
              !error &&
              !loading && <div className="mono-label plant-screen__result-placeholder">Analysis will appear here</div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {history.length > 0 && (
        <motion.div
          className="plant-screen__history"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="mono-label plant-screen__history-title">Previous scans</div>
          <div className="plant-screen__history-list">
            {history.map((s, i) => (
              <motion.div
                key={s.id}
                className={`plant-screen__history-item plant-screen__history-item--${overallScanLevel(s)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <LeafIcon />
                <div className="mono-label">{formatRelativeTime(s.created_at)}</div>
                <div className="plant-screen__history-status">{capitalize(overallScanLevel(s))}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
