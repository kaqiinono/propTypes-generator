const astHelper = require('./astHelper');
const actionHelper = require('./utils/actionHelper');
const { validFile } = require('./actions/finalExport');

async function generate(srcCode, componentName) {
  debugger
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
exports.flowAst = astHelper.flowAst;


// const { files } = require('./files.json');
// const { findExports } = require('./actions/finalExport');
// const result = [];
// findExports(files, '/index.js', result);
// console.log(result);
// result.forEach(r => {
//   const ret = {};
//
//   generate(validFile(files, r.filePath)?.code, r.fileName).then(d => fs.writeFileSync('./RESULT.json', JSON.stringify(d)))
// });


const path = require('path');
const fs = require('fs');
const srcCode = fs.readFileSync(path.resolve(__dirname,'./Button.jsx'));
generate(srcCode,'Button')
