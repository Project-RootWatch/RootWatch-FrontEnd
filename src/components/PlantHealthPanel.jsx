import { useEffect, useRef, useState } from "react";
import { postPlantHealth } from "../api/client";
import "./PlantHealthPanel.css";

export default function PlantHealthPanel() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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
    setAssessment(null);
    setError(null);
  }

  function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    postPlantHealth(file)
      .then((data) => setAssessment(data.assessment_text))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="plant-health-panel">
      <div className="plant-health-panel__title">Plant health</div>

      <div className="plant-health-panel__body">
        <div className="plant-health-panel__upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleFileChange}
            className="plant-health-panel__file-input"
            id="plant-photo-input"
          />
          <label htmlFor="plant-photo-input" className="plant-health-panel__choose-button">
            {file ? "Choose a different photo" : "Choose a leaf photo"}
          </label>

          {previewUrl && (
            <img src={previewUrl} alt="Selected leaf" className="plant-health-panel__preview" />
          )}

          <button
            className="plant-health-panel__analyze-button"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="plant-health-panel__result">
          {error && <div className="plant-health-panel__error">{error}</div>}
          {assessment && <p className="plant-health-panel__text">{assessment}</p>}
          {!assessment && !error && !loading && (
            <div className="plant-health-panel__placeholder">
              Upload a photo of a leaf to get a Sinhala health assessment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
