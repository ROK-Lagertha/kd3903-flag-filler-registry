/**
 * KD3903 Flag Filler Registry - Cloudflare Worker
 * Security hardening: bounded body reads, upstream timeout, safe errors,
 * origin checks for browser write requests, and security headers.
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf08HDigoP9g1it_OQY8Nr_7sc0xOq0FKo0yExN0jQoFGcDp2tXCXOGmnJw9i42EX_/exec";
const MAX_BODY_BYTES = 8192;
const UPSTREAM_TIMEOUT_MS = 12000;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...extraHeaders
    }
  });
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser/server clients
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function validPayload(action, p) {
  if (!p || typeof p !== "object" || Array.isArray(p)) return false;
  const id = v => /^\d+$/.test(String(v || "").trim());
  const name = v => {
    const s = String(v || "").trim();
    return s.length > 0 && s.length <= 80;
  };
  const code = v => {
    const s = String(v || "").trim();
    return s.length > 0 && s.length <= 160;
  };
  if (!id(p.mainId) || !id(p.flagId) || String(p.mainId).trim() === String(p.flagId).trim()) return false;
  if (action === "REGISTER") return name(p.mainName) && name(p.flagName);
  if (action === "RENAME") return code(p.removalCode) && (name(p.mainName) || name(p.flagName));
  if (action === "REMOVE") return code(p.removalCode);
  return false;
}

async function readJsonBounded(request) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { response: json({ ok:false, error:"PAYLOAD_TOO_LARGE" }, 413) };
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > MAX_BODY_BYTES) {
    return { response: json({ ok:false, error:"PAYLOAD_TOO_LARGE" }, 413) };
  }

  try {
    return { data: JSON.parse(new TextDecoder().decode(buffer)) };
  } catch {
    return { response: json({ ok:false, error:"INVALID_JSON" }, 400) };
  }
}

async function callAppsScript(env, action, payload = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: env.APPS_SCRIPT_API_SECRET,
        action,
        payload
      }),
      redirect: "follow",
      signal: controller.signal
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); }
    catch { return { response: json({ ok:false, error:"UPSTREAM_INVALID_RESPONSE" }, 502) }; }

    if (!upstream.ok) return { response: json({ ok:false, error:"UPSTREAM_ERROR" }, 502) };
    return { data };
  } catch {
    return { response: json({ ok:false, error:"UPSTREAM_UNAVAILABLE" }, 502) };
  } finally {
    clearTimeout(timer);
  }
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-frame-options", "DENY");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      if (request.method !== "GET") return json({ ok:false, error:"METHOD_NOT_ALLOWED" }, 405);
      if (!env.APPS_SCRIPT_API_SECRET) return json({ ok:false, error:"API_NOT_CONFIGURED" }, 503);
      const result = await callAppsScript(env, "PING", {});
      if (result.response) return result.response;
      const data = result.data;
      return json(data, data && data.ok ? 200 : 502);
    }

    if (url.pathname === "/api/registry") {
      if (request.method !== "POST") return json({ ok:false, error:"METHOD_NOT_ALLOWED" }, 405);
      if (!sameOrigin(request)) return json({ ok:false, error:"FORBIDDEN_ORIGIN" }, 403);
      if (!env.APPS_SCRIPT_API_SECRET) return json({ ok:false, error:"API_NOT_CONFIGURED" }, 503);

      const type = request.headers.get("content-type") || "";
      if (!type.toLowerCase().includes("application/json")) {
        return json({ ok:false, error:"INVALID_CONTENT_TYPE" }, 415);
      }

      const parsed = await readJsonBounded(request);
      if (parsed.response) return parsed.response;

      const body = parsed.data;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ ok:false, error:"INVALID_REQUEST" }, 400);
      }

      const action = String(body.action || "").trim().toUpperCase();
      const payload = body.payload || {};
      if (!["REGISTER","RENAME","REMOVE"].includes(action)) return json({ ok:false, error:"INVALID_ACTION" }, 400);
      if (!validPayload(action, payload)) return json({ ok:false, error:"INVALID_REQUEST" }, 400);

      const result = await callAppsScript(env, action, payload);
      if (result.response) return result.response;
      const data = result.data;
      return json(data, data && data.ok ? 200 : 400);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};
