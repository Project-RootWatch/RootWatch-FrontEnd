import { useEffect, useState } from "react";
import { getReadingHistory } from "../api/client";
import MoistureTrendChart from "../components/MoistureTrendChart";
import MiniStat from "../components/MiniStat";
import { ChartIcon } from "../components/icons";
import "./ChartScreen.css";

const HISTORY_POLL_MS = 30000;

export default function ChartScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;

    function loadHistory() {
      getReadingHistory(100)
        .then((data) => !cancelled && setHistory(data))
        .catch(() => {});
    }

    loadHistory();
    const interval = setInterval(loadHistory, HISTORY_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const moistureValues = history.map((r) => r.soil_moisture);
  const min = moistureValues.length ? Math.min(...moistureValues) : undefined;
  const max = moistureValues.length ? Math.max(...moistureValues) : undefined;
  const avg = moistureValues.length
    ? Math.round(moistureValues.reduce((a, b) => a + b, 0) / moistureValues.length)
    : undefined;

  return (
    <div className="chart-screen">
      <div className="chart-screen__header">
        <div className="chart-screen__title">Trends</div>
        <div className="mono-label">Soil moisture over time</div>
      </div>

      <div className="chart-screen__chart">
        <MoistureTrendChart data={history} />
      </div>

      <div className="chart-screen__stats">
        <MiniStat icon={<ChartIcon />} value={min !== undefined ? Math.round(min) : "—"} unit="%" label="Min" />
        <MiniStat icon={<ChartIcon />} value={avg ?? "—"} unit="%" label="Avg" />
        <MiniStat icon={<ChartIcon />} value={max !== undefined ? Math.round(max) : "—"} unit="%" label="Max" />
      </div>
    </div>
  );
}
