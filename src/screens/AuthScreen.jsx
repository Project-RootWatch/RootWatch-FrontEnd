import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, signup, forgotPassword } from "../api/client";
import { setToken } from "../auth";
import "./AuthScreen.css";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forgotSent, setForgotSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "forgot") {
      forgotPassword(email)
        .then(() => setForgotSent(true))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      return;
    }

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
    setForgotSent(false);
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

        {mode !== "forgot" && (
          <div className="auth-card__tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
              Log in
            </button>
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>
              Sign up
            </button>
          </div>
        )}

        {mode === "forgot" && forgotSent ? (
          <div className="auth-form__sent">
            <p>If an account exists for that email, a reset link has been sent.</p>
            <p className="mono-label">(Dev mode: check the backend's console output for the link.)</p>
            <button type="button" className="auth-form__back" onClick={() => switchMode("login")}>
              Back to log in
            </button>
          </div>
        ) : (
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

            {mode !== "forgot" && (
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
            )}

            {mode === "login" && (
              <button type="button" className="auth-form__forgot-link" onClick={() => switchMode("forgot")}>
                Forgot password?
              </button>
            )}

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
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
            </motion.button>

            {mode === "forgot" && (
              <button type="button" className="auth-form__back" onClick={() => switchMode("login")}>
                Back to log in
              </button>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
