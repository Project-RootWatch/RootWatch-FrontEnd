import { useEffect, useState } from "react";
import { getCurrentReading, getReadingHistory } from "./api/client";
import StatTile from "./components/StatTile";
import MoistureTrendChart from "./components/MoistureTrendChart";
import AdvisoryPanel from "./components/AdvisoryPanel";
import "./App.css";

const CURRENT_POLL_MS = 10000;
const HISTORY_POLL_MS = 30000;

function App() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function loadCurrent() {
      getCurrentReading()
        .then((data) => {
          if (!cancelled) {
            setCurrent(data);
            setError(null);
          }
        })
        .catch((err) => !cancelled && setError(err.message));
    }

    loadCurrent();
    const interval = setInterval(loadCurrent, CURRENT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">RootWatch</h1>
        <p className="dashboard__subtitle">Live soil, climate, and plant monitoring</p>
      </header>

      {error && <div className="dashboard__error">Couldn't reach the backend: {error}</div>}

      <section className="dashboard__stats">
        <StatTile label="Soil moisture" value={current ? current.soil_moisture : "—"} unit="%" />
        <StatTile label="Temperature" value={current ? current.temperature : "—"} unit="°C" />
        <StatTile label="Light level" value={current ? current.light_level : "—"} unit="%" />
      </section>

      <section className="dashboard__chart">
        <MoistureTrendChart data={history} />
      </section>

      <section className="dashboard__advisory">
        <AdvisoryPanel />
      </section>
    </div>
  );
}

export default App;
