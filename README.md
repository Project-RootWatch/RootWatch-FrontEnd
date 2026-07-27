# RootWatch — Web Dashboard

React web dashboard for the RootWatch smart soil, irrigation, and plant
health monitoring system.

## Role in the system

Displays live and historical sensor data, forecast/risk status, plant
health assessments, and advisory text, and lets a user manually trigger
irrigation. Talks only to **RootWatch-BackEnd**'s REST API — no direct
connection to the ESP32 or any ML/AI service. The Flutter mobile app
(**RootWatch-Mobile**) consumes the same backend API and mirrors this
dashboard's core screens.

## Status

Early scaffold (default Vite + React template). Dashboard features start
in a later build step once the backend has real endpoints to poll.

## Running locally

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:5173` by default.

## Tech stack

- React + Vite
- Polls RootWatch-BackEnd REST API for sensor readings, forecasts, and
  advisory data
