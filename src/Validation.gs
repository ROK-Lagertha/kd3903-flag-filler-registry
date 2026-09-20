function normalizeId_(value) {
  const id = String(value || '').trim();
  if (!/^\d+$/.test(id)) throw new Error('INVALID_GOVERNOR_ID');
  return id;
}

function cleanName_(value) {
  const name = String(value || '').trim();
  if (!name || name.length > 80) throw new Error('INVALID_GOVERNOR_NAME');
  return name;
}

function normalizeLanguage_(value) {
  const lang = String(value || 'en').trim().toLowerCase();
  return /^[a-z]{2}(-[a-z]{2})?$/.test(lang) ? lang : 'en';
}

function findActiveByMain_(mainId, rows) {
  return rows.find(row =>
    String(row[1]).trim() === mainId &&
    String(row[5]).trim().toUpperCase() === 'ACTIVE'
  );
}

function findActiveByFlag_(flagId, rows) {
  return rows.find(row =>
    String(row[3]).trim() === flagId &&
    String(row[5]).trim().toUpperCase() === 'ACTIVE'
  );
}
