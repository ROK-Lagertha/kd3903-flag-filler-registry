function makeToken_(prefix, length) {
  const token = Utilities.getUuid().replace(/-/g, '').slice(0, length || 8).toUpperCase();
  return prefix + '-' + token;
}

function makeRecordId_() {
  return makeToken_('FF', 10);
}

function makeRemovalCode_() {
  return makeToken_('3903', 8);
}

function makeLogId_() {
  return makeToken_('LOG', 10);
}
