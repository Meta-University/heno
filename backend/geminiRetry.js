function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries transient Gemini overload (HTTP 503). Does not retry 429 (quota).
 */
export async function withGeminiRetry(operation, label = "request") {
  const max = Math.max(1, Number(process.env.GEMINI_RETRY_ATTEMPTS || 4));
  const baseMs = Number(process.env.GEMINI_RETRY_BASE_MS || 1500);
  let lastErr;
  for (let i = 0; i < max; i++) {
    if (i > 0) {
      const delay = Math.min(baseMs * 2 ** (i - 1), 30_000);
      await sleep(delay);
    }
    try {
      return await operation();
    } catch (err) {
      lastErr = err;
      if (err?.status !== 503 || i === max - 1) {
        throw err;
      }
      console.warn(
        `Gemini ${label}: HTTP ${err.status}, retrying (${i + 2}/${max})…`
      );
    }
  }
  throw lastErr;
}
