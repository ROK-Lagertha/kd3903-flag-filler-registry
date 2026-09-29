/**
 * KD3903 Flag Filler Registry - Cloudflare API bridge
 * Script Property required:
 *   CF_API_SECRET = same secret stored in Cloudflare as APPS_SCRIPT_API_SECRET
 */
function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const secret = PropertiesService.getScriptProperties().getProperty('CF_API_SECRET');

    if (!secret) return apiJson_({ ok: false, error: 'API_NOT_CONFIGURED' });
    if (!body || String(body.secret || '') !== String(secret)) {
      return apiJson_({ ok: false, error: 'UNAUTHORIZED' });
    }

    const action = String(body.action || '').trim().toUpperCase();
    const payload = body.payload || {};

    // Safe health check: no Registry.gs call and no Sheet access.
    if (action === 'PING') {
      return apiJson_({ ok: true, result: { status: 'PONG' } });
    }

    let result;
    switch (action) {
      case 'REGISTER':
        result = registerFlagFiller(payload);
        break;
      case 'RENAME':
        result = renameFlagFiller(payload);
        break;
      case 'REMOVE':
        result = removeFlagFiller(payload);
        break;
      default:
        return apiJson_({ ok: false, error: 'INVALID_ACTION' });
    }

    return apiJson_({ ok: true, result: result || { ok: true } });
  } catch (err) {
    return apiJson_({
      ok: false,
      error: String(err && err.message ? err.message : err || 'UNKNOWN_ERROR')
    });
  }
}

function apiJson_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
