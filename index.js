const astHelper = require('./astHelper');
const actionHelper = require('./utils/actionHelper');
const { validFile } = require('./actions/finalExport');

async function generate(srcCode, componentName) {
  if (!srcCode) {
    return;
  }

  if (!componentName) {
    throw new Error('You must select the text as a Component\'s name !');
    return;
  }

  const ast = astHelper.flowAst(String(srcCode));
  if (!ast) {
    throw new Error('Parse JS file error !');
    return;
  }
  // merge config to options
  const options = Object.assign({}, {}, { name: componentName });
  const result = await actionHelper.generatePropTypesCode(ast, options);
  return result;
}

exports.generate = generate;
exports.validFile = validFile;
