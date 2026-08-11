import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import "./MoistureTrendChart.css";

const WIDTH = 640;
const HEIGHT = 280;
const MARGIN = { top: 20, right: 16, bottom: 32, left: 40 };
const PLOT_LEFT = MARGIN.left;
const PLOT_RIGHT = WIDTH - MARGIN.right;
const PLOT_TOP = MARGIN.top;
const PLOT_BOTTOM = HEIGHT - MARGIN.bottom;

const Y_TICKS = [0, 25, 50, 75, 100];

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MoistureTrendChart({ data, forecast }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const hasForecast = Array.isArray(forecast) && forecast.length > 0;

  // History and forecast share one time-based x-scale, spanning from the
  // earliest history point to the last forecast point (or last history
  // point, if there's no forecast).
  const { points, forecastPoints } = useMemo(() => {
    if (data.length === 0) return { points: [], forecastPoints: [] };

    const historyTimes = data.map((d) => new Date(d.timestamp).getTime());
    const forecastTimes = hasForecast ? forecast.map((d) => new Date(d.timestamp).getTime()) : [];
    const allTimes = [...historyTimes, ...forecastTimes];
    const minT = Math.min(...allTimes);
    const maxT = Math.max(...allTimes);
    const span = maxT - minT || 1;

    const toXY = (t, value) => ({
      x: PLOT_LEFT + ((t - minT) / span) * (PLOT_RIGHT - PLOT_LEFT),
      y: PLOT_BOTTOM - (value / 100) * (PLOT_BOTTOM - PLOT_TOP),
    });

    const points = data.map((d, i) => ({ ...toXY(historyTimes[i], d.soil_moisture), reading: d, predicted: false }));
    const forecastPoints = hasForecast
      ? forecast.map((d, i) => ({ ...toXY(forecastTimes[i], d.soil_moisture), reading: d, predicted: true }))
      : [];

    return { points, forecastPoints };
  }, [data, forecast, hasForecast]);

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    [points]
  );

  const forecastPath = useMemo(() => {
    if (!hasForecast || points.length === 0) return "";
    const last = points[points.length - 1];
    return [last, ...forecastPoints].map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [forecastPoints, hasForecast, points]);

  const allHoverable = useMemo(() => [...points, ...forecastPoints], [points, forecastPoints]);

  function handlePointerMove(event) {
    if (allHoverable.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const pointerX = (event.clientX - rect.left) * scaleX;

    let nearest = 0;
    let nearestDist = Infinity;
    allHoverable.forEach((p, i) => {
      const dist = Math.abs(p.x - pointerX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  function handlePointerLeave() {
    setHoverIndex(null);
  }

  const hovered = hoverIndex !== null ? allHoverable[hoverIndex] : null;
  const last = points[points.length - 1];
  const lastForecast = forecastPoints[forecastPoints.length - 1];

  return (
    <motion.div
      className="trend-chart"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="trend-chart__title">
        Soil moisture — last {data.length} readings{hasForecast ? " + 6h forecast" : ""}
      </div>

      {points.length === 0 ? (
        <div className="trend-chart__empty">No readings yet</div>
      ) : (
        <svg
          ref={svgRef}
          className="trend-chart__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {Y_TICKS.map((tick) => {
            const y = PLOT_BOTTOM - (tick / 100) * (PLOT_BOTTOM - PLOT_TOP);
            return (
              <g key={tick}>
                <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={y} y2={y} className="trend-chart__gridline" />
                <text x={PLOT_LEFT - 8} y={y} className="trend-chart__axis-label" textAnchor="end" dominantBaseline="middle">
                  {tick}%
                </text>
              </g>
            );
          })}

          <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} className="trend-chart__baseline" />

          <text x={PLOT_LEFT} y={HEIGHT - 8} className="trend-chart__axis-label" textAnchor="start">
            {formatTime(points[0].reading.timestamp)}
          </text>
          <text x={PLOT_RIGHT} y={HEIGHT - 8} className="trend-chart__axis-label" textAnchor="end">
            {formatTime((hasForecast ? forecast[forecast.length - 1] : points[points.length - 1].reading).timestamp)}
          </text>

          <motion.path
            d={linePath}
            className="trend-chart__line"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          {hasForecast && (
            <motion.path
              d={forecastPath}
              className="trend-chart__forecast-line"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            />
          )}

          {hasForecast && lastForecast && (
            <motion.text
              x={lastForecast.x}
              y={lastForecast.y - 12}
              className="trend-chart__forecast-label"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              predicted {lastForecast.reading.soil_moisture}%
            </motion.text>
          )}

          <motion.circle
            cx={last.x}
            cy={last.y}
            r="5"
            className="trend-chart__end-dot"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          />
          <motion.circle
            cx={last.x}
            cy={last.y}
            r="5"
            className="trend-chart__end-dot"
            style={{ fill: "none" }}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ delay: 0.9, duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          {!hasForecast && (
            <motion.text
              x={last.x - 10}
              y={last.y - 12}
              className="trend-chart__end-label"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              {last.reading.soil_moisture}%
            </motion.text>
          )}

          {hovered && (
            <g>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={PLOT_TOP}
                y2={PLOT_BOTTOM}
                className="trend-chart__crosshair"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r="5"
                className={hovered.predicted ? "trend-chart__hover-dot trend-chart__hover-dot--predicted" : "trend-chart__hover-dot"}
              />
            </g>
          )}
        </svg>
      )}

      {hovered && (
        <div className="trend-chart__tooltip" style={{ left: `${(hovered.x / WIDTH) * 100}%` }}>
          <div className="trend-chart__tooltip-value">
            {hovered.reading.soil_moisture}%{hovered.predicted && <span className="trend-chart__tooltip-tag"> predicted</span>}
          </div>
          <div className="trend-chart__tooltip-time">{formatTime(hovered.reading.timestamp)}</div>
        </div>
      )}
    </motion.div>
  );
}
