import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { resetPassword } from "../api/client";
import "./AuthScreen.css";

export default function ResetPasswordScreen({ token, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    resetPassword(token, password)
      .then(() => setDone(true))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
        <div className="mono-label auth-card__tagline">Set a new password</div>

        {done ? (
          <div className="auth-form__sent">
            <p>Your password has been updated.</p>
            <button type="button" className="auth-form__back" onClick={onDone}>
              Continue to log in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-form__field">
              <span className="mono-label">New password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </label>

            <label className="auth-form__field">
              <span className="mono-label">Confirm password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat the password"
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
              {loading ? "Please wait..." : "Set new password"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
