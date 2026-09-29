/**
 * KD3903 Flag Filler Registry - Cloudflare Worker
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf08HDigoP9g1it_OQY8Nr_7sc0xOq0FKo0yExN0jQoFGcDp2tXCXOGmnJw9i42EX_/exec";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

function validPayload(action, p) {
  if (!p || typeof p !== "object") return false;
  const id = v => /^\d+$/.test(String(v || "").trim());
  const name = v => {
    const s = String(v || "").trim();
    return s.length > 0 && s.length <= 80;
  };
  if (!id(p.mainId) || !id(p.flagId) || String(p.mainId).trim() === String(p.flagId).trim()) return false;
  if (action === "REGISTER") return name(p.mainName) && name(p.flagName);
  if (action === "RENAME") {
    if (!String(p.removalCode || "").trim()) return false;
    return name(p.mainName) || name(p.flagName);
  }
  if (action === "REMOVE") return !!String(p.removalCode || "").trim();
  return false;
}

async function callAppsScript(env, action, payload = {}) {
  const upstream = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret: env.APPS_SCRIPT_API_SECRET,
      action,
      payload
    }),
    redirect: "follow"
  });
  const text = await upstream.text();
  let data;
  try { data = JSON.parse(text); }
  catch { return { response: json({ ok:false, error:"UPSTREAM_INVALID_RESPONSE" }, 502) }; }
  if (!upstream.ok) return { response: json({ ok:false, error:"UPSTREAM_ERROR" }, 502) };
  return { data };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Safe end-to-end health check. No Sheets are read or written.
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
      if (!env.APPS_SCRIPT_API_SECRET) return json({ ok:false, error:"API_NOT_CONFIGURED" }, 503);
      const type = request.headers.get("content-type") || "";
      if (!type.toLowerCase().includes("application/json")) return json({ ok:false, error:"INVALID_CONTENT_TYPE" }, 415);
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 8192) return json({ ok:false, error:"PAYLOAD_TOO_LARGE" }, 413);

      let body;
      try { body = await request.json(); }
      catch { return json({ ok:false, error:"INVALID_JSON" }, 400); }

      const action = String(body.action || "").trim().toUpperCase();
      const payload = body.payload || {};
      if (!["REGISTER","RENAME","REMOVE"].includes(action)) return json({ ok:false, error:"INVALID_ACTION" }, 400);
      if (!validPayload(action, payload)) return json({ ok:false, error:"INVALID_REQUEST" }, 400);

      const result = await callAppsScript(env, action, payload);
      if (result.response) return result.response;
      const data = result.data;
      return json(data, data && data.ok ? 200 : 400);
    }

    return env.ASSETS.fetch(request);
  }
};
