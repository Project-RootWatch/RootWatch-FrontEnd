import { motion } from "motion/react";
import StatusPill from "./StatusPill";
import "./Header.css";

export default function Header({ status, user, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <div className="app-header__brand">RootWatch</div>
        <div className="app-header__meta mono-label">Tomato · Plot A · Field Unit #1</div>
      </div>

      <div className="app-header__right">
        <StatusPill level={status.level} label={status.label} />
        {user && (
          <div className="app-header__account">
            <span className="mono-label app-header__email">{user.email}</span>
            <motion.button
              className="app-header__logout"
              onClick={onLogout}
              whileHover={{ opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
            >
              Log out
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}
