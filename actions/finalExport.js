const recast = require('recast');
const astHelper = require('../astHelper');
const actionHelper = require('../utils/actionHelper');

function getExportPath(path, filePath) {
  const result = [];
  let node = path.node;
  if (node.source && (node.source.type === 'StringLiteral' || node.source.type === 'Literal')) {
    result.push({
      fileName: node.source.value,
      filePath: filePath
    });
  }

  const fileName = node.declaration && (node.declaration.name || node.declaration.id && node.declaration.id.name);
  if (fileName) {
    result.push({
      fileName: fileName,
      filePath: filePath
    });
  }
  return result;
}

function getImportPath(path, callback) {
  let node = path.node;
  if (node.source && (node.source.type === 'StringLiteral' || node.source.type === 'Literal')) {
    if (node.source.value.startsWith('./')) {
      callback(node.source.value);
    }
  }
}

function validFile(files, name) {
  if (!name) {
    return;
  }

  if (name.endsWith('.js') || name.endsWith('.jsx')) {
    return files[name];
  }
  return files[`${name}.js`] || files[`${name}.jsx`] || files[`${name}.ts`] || files[`${name}.tsx`];
}

function findFromImport(files, filePath) {
  let result = [];
  const fileName = validFile(files, filePath);
  const ast = fileName && astHelper.flowAst(fileName && fileName.code);
  if (ast) {
    recast.visit(ast, {
      visitImportDeclaration: function(path) {
        getImportPath(path, (p) => {
          result = result.concat(findExports(files, p.slice(1)));
        });
        this.traverse(path);
      }
    });
  }
  return result;
}


function findExports(files, filePath = '/index.js') {
  const fileName = validFile(files, filePath);
  const ast = astHelper.flowAst(fileName && fileName.code);
  let result = [];
  if (ast) {
    recast.visit(ast, {
      visitExportAllDeclaration: function(path) {
        result = result.concat(getExportPath(path, filePath));
        this.traverse(path);
      },
      visitExportNamedDeclaration: function(path) {
        result = result.concat(getExportPath(path, filePath));
        this.traverse(path);
      },
      visitExportDefaultDeclaration: function(path) {
        result = result.concat(getExportPath(path, filePath));
        this.traverse(path);
      },
    });
  }

  if (result.length <= 0) {
    result = findFromImport(files, filePath);
  }

  for (const r of result) {
    const file = validFile(files, r.filePath);
    if (file && /<Provider.*>.*\s+.*\s+<\/Provider>/g.test(file.code)) {
      return findFromImport(files, r.filePath);
    }
  }

  return result;
}

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

module.exports = {
  validFile, findExports, generate
};
