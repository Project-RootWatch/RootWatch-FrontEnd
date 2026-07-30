import { useEffect, useRef, useState } from "react";
import { postPlantHealth, getPlantHealthHistory } from "../api/client";
import StatusPill from "../components/StatusPill";
import MetricChip from "../components/MetricChip";
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
    <div className="plant-screen">
      <div className="plant-screen__header">
        <div className="plant-screen__title">Plant Health</div>
        <div className="mono-label">Gemini Vision analysis</div>
      </div>

      <div className="plant-screen__grid">
        <div className="plant-screen__photo-card">
          {scan && (
            <div className="plant-screen__photo-pill">
              <StatusPill level={overallScanLevel(scan)} label={capitalize(overallScanLevel(scan))} />
            </div>
          )}

          {previewUrl ? (
            <img src={previewUrl} alt="Selected leaf" className="plant-screen__photo" />
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
          <label htmlFor="plant-photo-input" className="plant-screen__choose-button">
            {loading ? "Analyzing..." : file ? "Choose a different photo" : "Choose photo"}
          </label>
        </div>

        <div className="plant-screen__result-pane">
          {error && <div className="plant-screen__error">{error}</div>}

          {scan ? (
            <div className="plant-screen__result">
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
            </div>
          ) : (
            !error && <div className="mono-label plant-screen__result-placeholder">Analysis will appear here</div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="plant-screen__history">
          <div className="mono-label plant-screen__history-title">Previous scans</div>
          <div className="plant-screen__history-list">
            {history.map((s) => (
              <div key={s.id} className={`plant-screen__history-item plant-screen__history-item--${overallScanLevel(s)}`}>
                <LeafIcon />
                <div className="mono-label">{formatRelativeTime(s.created_at)}</div>
                <div className="plant-screen__history-status">{capitalize(overallScanLevel(s))}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
