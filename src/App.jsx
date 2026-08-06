import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const SCREENS = {
  soil: SoilScreen,
  chart: ChartScreen,
  plant: PlantScreen,
  water: WaterScreen,
  log: LogScreen,
};

const screenVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

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
  const ActiveScreen = SCREENS[activeTab];

  return (
    <div className="app-shell">
      <Header status={status} />

      <div className="app-body">
        <Sidebar active={activeTab} onChange={setActiveTab} />

        <main className="app-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeTab === "soil" ? <ActiveScreen current={current} status={status} /> : <ActiveScreen />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
