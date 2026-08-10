import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, signup } from "../api/client";
import { setToken } from "../auth";
import "./AuthScreen.css";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const action = mode === "login" ? login : signup;
    action(email, password)
      .then((data) => {
        setToken(data.access_token);
        onAuthenticated(data.user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function switchMode(next) {
    setMode(next);
    setError(null);
  }

  return (
    <div className="auth-screen">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="auth-card__brand">RootWatch</div>
        <div className="mono-label auth-card__tagline">Smart soil, irrigation &amp; plant health</div>

        <div className="auth-card__tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-form__field">
            <span className="mono-label">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-form__field">
            <span className="mono-label">Password</span>
            <input
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
            />
          </label>

          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-form__error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="auth-form__submit"
            disabled={loading}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
