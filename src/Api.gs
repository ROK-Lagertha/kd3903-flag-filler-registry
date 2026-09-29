/**
 * KD3903 Flag Filler Registry - Cloudflare API bridge
 * Script Property required:
 *   CF_API_SECRET = same secret stored in Cloudflare as APPS_SCRIPT_API_SECRET
 */
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (!raw || raw.length > 12000) return apiJson_({ ok: false, error: 'INVALID_REQUEST' });

    const body = JSON.parse(raw);
    const secret = PropertiesService.getScriptProperties().getProperty('CF_API_SECRET');

    if (!secret) return apiJson_({ ok: false, error: 'API_NOT_CONFIGURED' });
    if (!body || String(body.secret || '') !== String(secret)) {
      return apiJson_({ ok: false, error: 'UNAUTHORIZED' });
    }

    const action = String(body.action || '').trim().toUpperCase();
    const payload = body.payload || {};

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
    // Never expose Apps Script, Sheet or implementation details to the public API.
    console.error('Registry API error: ' + String(err && err.stack ? err.stack : err));
    return apiJson_({ ok: false, error: apiPublicError_(err) });
  }
}

function apiPublicError_(err) {
  const message = String(err && err.message ? err.message : err || '').toUpperCase();

  // Preserve only known business errors that the frontend can safely translate.
  const safeCodes = [
    'MAIN_ALREADY_REGISTERED',
    'FLAG_ALREADY_REGISTERED',
    'MAIN_AND_FLAG_MUST_DIFFER',
    'INVALID_GOVERNOR_ID',
    'INVALID_GOVERNOR_NAME',
    'REMOVAL_CODE_REQUIRED',
    'INVALID_REMOVAL_CODE',
    'REGISTRATION_NOT_FOUND',
    'NO_NAME_CHANGE',
    'INVALID_REQUEST'
  ];

  for (let i = 0; i < safeCodes.length; i++) {
    if (message.indexOf(safeCodes[i]) !== -1) return safeCodes[i];
  }
  return 'REQUEST_FAILED';
}

function apiJson_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
