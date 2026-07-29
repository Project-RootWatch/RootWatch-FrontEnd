import { useEffect, useState } from "react";
import { getCurrentReading } from "./api/client";
import { getRiskStatus } from "./status";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import SoilScreen from "./screens/SoilScreen";
import "./App.css";

const CURRENT_POLL_MS = 10000;

function ComingSoon({ name }) {
  return <div className="coming-soon mono-label">{name} — building next</div>;
}

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

      <main className="app-main">
        {activeTab === "soil" && <SoilScreen current={current} status={status} />}
        {activeTab === "chart" && <ComingSoon name="Chart" />}
        {activeTab === "plant" && <ComingSoon name="Plant" />}
        {activeTab === "water" && <ComingSoon name="Water" />}
        {activeTab === "log" && <ComingSoon name="Log" />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
