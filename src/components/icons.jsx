const common = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function SoilIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M10 3c-2.5 2-2.5 5 0 6.5C12.5 8 12.5 5 10 3z" />
      <path d="M3 10h14M3 13h14M3 16h14" />
    </svg>
  );
}

export function ChartIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M2 14l4-5 3 3 5-7 4 4" />
    </svg>
  );
}

export function LeafIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 16c0-7 4-11 12-12-1 8-5 12-12 12z" />
      <path d="M4 16c2-4 5-7 10-10" />
    </svg>
  );
}

export function DropletIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M10 2.5S4 9 4 12.5a6 6 0 0012 0C16 9 10 2.5 10 2.5z" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.5V10l3 2" />
    </svg>
  );
}

export function ThermometerIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M11.5 11.2V4.5a1.5 1.5 0 00-3 0v6.7a3 3 0 103 0z" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="10" cy="10" r="3.2" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M4.6 15.4L6 14M14 6l1.4-1.4" />
    </svg>
  );
}

export function WarningIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M10 3l8 14H2L10 3z" />
      <path d="M10 8v3.5M10 14v.01" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.5 10.2l2.3 2.3 4.7-5" />
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 7a1.5 1.5 0 011.5-1.5h1.2L7 4h6l1.3 1.5h1.2A1.5 1.5 0 0117 7v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 14V7z" />
      <circle cx="10" cy="10.5" r="3" />
    </svg>
  );
}
