// Simple in-memory rate limiter; swap with Redis for production
const limits = new Map();
export function checkRateLimit(userId, max = 10) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `${userId}:${today}`;
  const count = limits.get(key) || 0;
  if (count >= max) return false;
  limits.set(key, count + 1);
  return true;
}