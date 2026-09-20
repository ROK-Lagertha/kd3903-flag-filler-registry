function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('KD3903 Flag Filler Registry')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getPublicConfig() {
  const config = getConfig_();
  return {
    kingdom: String(config.KINGDOM || '3903'),
    defaultLanguage: String(config.DEFAULT_LANGUAGE || 'en'),
    appStatus: String(config.APP_STATUS || 'SETUP')
  };
}
