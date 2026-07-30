import { useEffect, useState } from "react";
import { getCurrentReading } from "./api/client";
import { getRiskStatus } from "./status";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SoilScreen from "./screens/SoilScreen";
import ChartScreen from "./screens/ChartScreen";
import PlantScreen from "./screens/PlantScreen";
import WaterScreen from "./screens/WaterScreen";
import LogScreen from "./screens/LogScreen";
import "./App.css";

const CURRENT_POLL_MS = 10000;

function App() {
  const [activeTab, setActiveTab] = useState("soil");
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function loadCurrent() {
      getCurrentReading()
        .then((data) => !cancelled && setCurrent(data))
        .catch(() => {});
    }

    loadCurrent();
    const interval = setInterval(loadCurrent, CURRENT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const status = getRiskStatus(current);

  return (
    <div className="app-shell">
      <Header status={status} />

      <div className="app-body">
        <Sidebar active={activeTab} onChange={setActiveTab} />

        <main className="app-main">
          {activeTab === "soil" && <SoilScreen current={current} status={status} />}
          {activeTab === "chart" && <ChartScreen />}
          {activeTab === "plant" && <PlantScreen />}
          {activeTab === "water" && <WaterScreen />}
          {activeTab === "log" && <LogScreen />}
        </main>
      </div>
    </div>
  );
}

export default App;
