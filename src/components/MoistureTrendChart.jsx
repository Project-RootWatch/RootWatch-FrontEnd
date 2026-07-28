import { useMemo, useRef, useState } from "react";
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

export default function MoistureTrendChart({ data }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const points = useMemo(() => {
    if (data.length === 0) return [];

    const times = data.map((d) => new Date(d.timestamp).getTime());
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const span = maxT - minT || 1;

    return data.map((d, i) => ({
      x: PLOT_LEFT + ((times[i] - minT) / span) * (PLOT_RIGHT - PLOT_LEFT),
      y: PLOT_BOTTOM - (d.soil_moisture / 100) * (PLOT_BOTTOM - PLOT_TOP),
      reading: d,
    }));
  }, [data]);

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    [points]
  );

  function handlePointerMove(event) {
    if (points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const pointerX = (event.clientX - rect.left) * scaleX;

    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
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

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const last = points[points.length - 1];

  return (
    <div className="trend-chart">
      <div className="trend-chart__title">Soil moisture — last {data.length} readings</div>

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
            {formatTime(points[points.length - 1].reading.timestamp)}
          </text>

          <path d={linePath} className="trend-chart__line" fill="none" />

          <circle cx={last.x} cy={last.y} r="5" className="trend-chart__end-dot" />
          <text x={last.x - 10} y={last.y - 12} className="trend-chart__end-label" textAnchor="end">
            {last.reading.soil_moisture}%
          </text>

          {hovered && (
            <g>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={PLOT_TOP}
                y2={PLOT_BOTTOM}
                className="trend-chart__crosshair"
              />
              <circle cx={hovered.x} cy={hovered.y} r="5" className="trend-chart__hover-dot" />
            </g>
          )}
        </svg>
      )}

      {hovered && (
        <div
          className="trend-chart__tooltip"
          style={{ left: `${(hovered.x / WIDTH) * 100}%` }}
        >
          <div className="trend-chart__tooltip-value">{hovered.reading.soil_moisture}%</div>
          <div className="trend-chart__tooltip-time">{formatTime(hovered.reading.timestamp)}</div>
        </div>
      )}
    </div>
  );
}
