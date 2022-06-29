const astHelper = require('./astHelper');
const actionHelper = require('./utils/actionHelper');

async function generate(srcCode) {
  if(!srcCode){
    return;
  }
  const componentName = 'Button';
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
  const options = Object.assign({}, {  }, { name: componentName });
  const result = await actionHelper.generatePropTypesCode(ast, options);
  return result;
}

exports.generate = generate;

const path = require('path');
const fs = require('fs');
const srcCode = fs.readFileSync(path.resolve(__dirname,'./Button.jsx'));
generate(srcCode).then(d=>fs.writeFileSync('./gen.json',JSON.stringify(d)));
