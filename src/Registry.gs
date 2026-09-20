function registerFlagFiller(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    payload = payload || {};

    const mainId = normalizeId_(payload.mainId);
    const flagId = normalizeId_(payload.flagId);
    if (mainId === flagId) throw new Error('MAIN_AND_FLAG_MUST_DIFFER');

    const mainName = cleanName_(payload.mainName);
    const flagName = cleanName_(payload.flagName);
    const language = normalizeLanguage_(payload.language);

    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEETS.REGISTRY);
    if (!sheet) throw new Error('REGISTRY_SHEET_NOT_FOUND');

    const rows = sheet.getDataRange().getValues().slice(1);

    if (findActiveByMain_(mainId, rows)) throw new Error('MAIN_ALREADY_REGISTERED');
    if (findActiveByFlag_(flagId, rows)) throw new Error('FLAG_ALREADY_REGISTERED');

    const now = new Date();
    const recordId = makeRecordId_();
    const removalCode = makeRemovalCode_();

    sheet.appendRow([
      recordId,
      mainId,
      mainName,
      flagId,
      flagName,
      'ACTIVE',
      now,
      '',
      removalCode,
      language,
      now
    ]);

    logChange_(
      'REGISTER',
      recordId,
      mainId,
      mainName,
      flagId,
      flagName,
      language,
      'Self-service registration'
    );

    return {
      ok: true,
      recordId: recordId,
      removalCode: removalCode
    };
  } finally {
    lock.releaseLock();
  }
}


function renameFlagFiller(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    payload = payload || {};

    const mainId = normalizeId_(payload.mainId);
    const flagId = normalizeId_(payload.flagId);
    const removalCode = String(payload.removalCode || '').trim().toUpperCase();
    const language = normalizeLanguage_(payload.language);

    if (!removalCode) throw new Error('REMOVAL_CODE_REQUIRED');

    const sheet = getSpreadsheet_().getSheetByName(SHEETS.REGISTRY);
    if (!sheet) throw new Error('REGISTRY_SHEET_NOT_FOUND');

    const rows = sheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const isMatch =
        String(row[1]).trim() === mainId &&
        String(row[3]).trim() === flagId &&
        String(row[5]).trim().toUpperCase() === 'ACTIVE';

      if (!isMatch) continue;

      if (String(row[8]).trim().toUpperCase() !== removalCode) {
        throw new Error('INVALID_REMOVAL_CODE');
      }

      const oldMainName = String(row[2]);
      const oldFlagName = String(row[4]);
      const requestedMainName = String(payload.mainName || '').trim();
      const requestedFlagName = String(payload.flagName || '').trim();

      if (!requestedMainName && !requestedFlagName) throw new Error('NO_NAME_CHANGE');

      const newMainName = requestedMainName ? cleanName_(requestedMainName) : oldMainName;
      const newFlagName = requestedFlagName ? cleanName_(requestedFlagName) : oldFlagName;

      if (oldMainName === newMainName && oldFlagName === newFlagName) {
        throw new Error('NO_NAME_CHANGE');
      }

      const now = new Date();
      sheet.getRange(i + 1, 3).setValue(newMainName);
      sheet.getRange(i + 1, 5).setValue(newFlagName);
      sheet.getRange(i + 1, 11).setValue(now);

      const changes = [];
      if (oldMainName !== newMainName) changes.push('Main: "' + oldMainName + '" -> "' + newMainName + '"');
      if (oldFlagName !== newFlagName) changes.push('Flag: "' + oldFlagName + '" -> "' + newFlagName + '"');

      logChange_('RENAME', row[0], mainId, newMainName, flagId, newFlagName, language, changes.join('; '));

      return { ok: true, mainName: newMainName, flagName: newFlagName };
    }

    throw new Error('REGISTRATION_NOT_FOUND');
  } finally {
    lock.releaseLock();
  }
}

function removeFlagFiller(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    payload = payload || {};

    const mainId = normalizeId_(payload.mainId);
    const flagId = normalizeId_(payload.flagId);
    const removalCode = String(payload.removalCode || '').trim().toUpperCase();
    const language = normalizeLanguage_(payload.language);

    if (!removalCode) throw new Error('REMOVAL_CODE_REQUIRED');

    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEETS.REGISTRY);
    if (!sheet) throw new Error('REGISTRY_SHEET_NOT_FOUND');

    const rows = sheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const isMatch =
        String(row[1]).trim() === mainId &&
        String(row[3]).trim() === flagId &&
        String(row[5]).trim().toUpperCase() === 'ACTIVE';

      if (!isMatch) continue;

      if (String(row[8]).trim().toUpperCase() !== removalCode) {
        throw new Error('INVALID_REMOVAL_CODE');
      }

      const now = new Date();
      sheet.getRange(i + 1, 6).setValue('REMOVED');
      sheet.getRange(i + 1, 8).setValue(now);
      sheet.getRange(i + 1, 11).setValue(now);

      logChange_(
        'REMOVE',
        row[0],
        mainId,
        row[2],
        flagId,
        row[4],
        language,
        'Self-service removal'
      );

      return { ok: true };
    }

    throw new Error('REGISTRATION_NOT_FOUND');
  } finally {
    lock.releaseLock();
  }
}

function logChange_(action, recordId, mainId, mainName, flagId, flagName, language, details) {
  const sheet = getSpreadsheet_().getSheetByName(SHEETS.LOG);
  if (!sheet) throw new Error('CHANGE_LOG_SHEET_NOT_FOUND');

  sheet.appendRow([
    makeLogId_(),
    new Date(),
    action,
    recordId,
    mainId,
    mainName,
    flagId,
    flagName,
    language,
    details
  ]);
}
