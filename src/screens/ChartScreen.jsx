import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getReadingHistory, getForecast } from "../api/client";
import MoistureTrendChart from "../components/MoistureTrendChart";
import MiniStat from "../components/MiniStat";
import { ChartIcon } from "../components/icons";
import "./ChartScreen.css";

const HISTORY_POLL_MS = 30000;
const FORECAST_POLL_MS = 60000;

const statsContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const statItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function ChartScreen() {
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState(null);

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

  useEffect(() => {
    let cancelled = false;

    // A missing forecast (not enough history yet) is an expected, normal
    // state right now — not a real error the user needs to see as one.
    function loadForecast() {
      getForecast()
        .then((data) => {
          if (cancelled) return;
          setForecast(data.forecast);
          setForecastError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          setForecast(null);
          setForecastError(err.message);
        });
    }

    loadForecast();
    const interval = setInterval(loadForecast, FORECAST_POLL_MS);
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
      <motion.div className="chart-screen__header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="chart-screen__title">Trends</div>
        <div className="mono-label">Soil moisture over time</div>
      </motion.div>

      <div className="chart-screen__chart">
        <MoistureTrendChart data={history} forecast={forecast} />
        {!forecast && forecastError && (
          <div className="chart-screen__forecast-note mono-label">Forecast unavailable: {forecastError}</div>
        )}
      </div>

      <motion.div className="chart-screen__stats" variants={statsContainer} initial="initial" animate="animate">
        <motion.div variants={statItem} style={{ flex: 1 }}>
          <MiniStat icon={<ChartIcon />} numericValue={min !== undefined ? Math.round(min) : undefined} value={min === undefined ? "—" : undefined} unit="%" label="Min" />
        </motion.div>
        <motion.div variants={statItem} style={{ flex: 1 }}>
          <MiniStat icon={<ChartIcon />} numericValue={avg} value={avg === undefined ? "—" : undefined} unit="%" label="Avg" />
        </motion.div>
        <motion.div variants={statItem} style={{ flex: 1 }}>
          <MiniStat icon={<ChartIcon />} numericValue={max !== undefined ? Math.round(max) : undefined} value={max === undefined ? "—" : undefined} unit="%" label="Max" />
        </motion.div>
      </motion.div>
    </div>
  );
}
