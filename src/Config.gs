const SHEETS = Object.freeze({
  REGISTRY: 'FLAG_FILLERS',
  ACTIVE: 'ACTIVE_FLAG_FILLERS',
  LOG: 'CHANGE_LOG',
  CONFIG: 'CONFIG'
});

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID_NOT_CONFIGURED');
  return SpreadsheetApp.openById(id);
}

function getConfig_() {
  const sheet = getSpreadsheet_().getSheetByName(SHEETS.CONFIG);
  if (!sheet) throw new Error('CONFIG_SHEET_NOT_FOUND');
  const values = sheet.getDataRange().getValues();
  const config = {};
  values.slice(1).forEach(row => {
    if (row[0] !== '') config[String(row[0])] = row[1];
  });
  return config;
}
