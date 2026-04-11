/** Primary model from env (default: gemini-2.5-flash). */
export function geminiPrimaryModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

/**
 * Optional second model to try on HTTP 429. If unset, picks the other Flash variant
 * (lite ↔ full) so requests can use a different quota bucket when possible.
 */
export function geminiFallbackModel() {
  const explicit = process.env.GEMINI_FALLBACK_MODEL?.trim();
  if (explicit) {
    return explicit;
  }
  const primary = geminiPrimaryModel();
  if (primary.includes("lite")) {
    return "gemini-2.5-flash";
  }
  return "gemini-2.5-flash-lite";
}
