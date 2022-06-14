function getConfig(key) {
  //todo
  return {};
}

function getCodeStyle(options = {}) {
  return {
    tabWidth: options.tabWidth || 2,
    quote: options.quote || null,
    trailingComma: options.trailingComma || false
  };
}

exports.getConfig = getConfig;
exports.getCodeStyle = getCodeStyle;
