const DISEASE_LEVELS = { none: "good", mild: "warning", severe: "critical" };
const STRESS_LEVELS = { none: "good", mild: "warning", moderate: "serious", severe: "critical" };
const GROWTH_LEVELS = { poor: "serious", normal: "good", vigorous: "good" };

export function diseaseLevel(value) {
  return DISEASE_LEVELS[value] ?? "good";
}

export function stressLevel(value) {
  return STRESS_LEVELS[value] ?? "good";
}

export function growthLevel(value) {
  return GROWTH_LEVELS[value] ?? "good";
}

export function overallScanLevel(scan) {
  const levels = [diseaseLevel(scan.disease), stressLevel(scan.stress), growthLevel(scan.growth)];
  if (levels.includes("critical")) return "critical";
  if (levels.includes("serious")) return "serious";
  if (levels.includes("warning")) return "warning";
  return "good";
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
