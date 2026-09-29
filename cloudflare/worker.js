/**
 * KD3903 Flag Filler Registry — Cloudflare foundation.
 * Phase 1 serves the new static shell only.
 * Existing Google Apps Script production remains untouched.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
