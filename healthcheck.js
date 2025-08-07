// healthcheck.js
const url = "http://localhost:3000/health";

try {
  const res = await fetch(url, { timeout: 2000 });
  if (res.ok) {
    process.exit(0); // Healthy
  } else {
    process.exit(1); // HTTP error
  }
} catch (err) {
  process.exit(1); // Network error or timeout
}
