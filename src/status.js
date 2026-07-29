// Mirrors the backend's placeholder threshold logic (routes/advisory.py
// classify_status) so the header pill doesn't need its own network call.
// Both sides get replaced by the LSTM risk output in a later step.
export function getRiskStatus(current) {
  if (!current) return { level: "good", label: "Normal" };
  if (current.soil_moisture < 30) return { level: "warning", label: "Caution" };
  if (current.soil_moisture > 75) return { level: "serious", label: "Caution" };
  return { level: "good", label: "Normal" };
}
