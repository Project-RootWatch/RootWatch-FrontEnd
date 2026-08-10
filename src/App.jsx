import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getCurrentReading, getCurrentUser } from "./api/client";
import { getRiskStatus } from "./status";
import { getToken, clearToken, UNAUTHORIZED_EVENT } from "./auth";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AuthScreen from "./screens/AuthScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
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

function Dashboard({ user, onLogout }) {
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
      <Header status={status} user={user} onLogout={onLogout} />

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

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [resetToken, setResetToken] = useState(() =>
    window.location.pathname === "/reset-password" ? new URLSearchParams(window.location.search).get("token") : null
  );

  useEffect(() => {
    if (!getToken()) {
      setCheckingSession(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => {}) // 401 handling already clears the token via the client
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  if (resetToken) {
    return (
      <ResetPasswordScreen
        token={resetToken}
        onDone={() => {
          window.history.replaceState({}, "", "/");
          setResetToken(null);
        }}
      />
    );
  }

  if (checkingSession) {
    return <div className="app-shell" />;
  }

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
