const recast = require('recast');
const astHelper = require('../astHelper');
const { flowAst } = require('../astHelper');

// const TNT = recast.types.namedTypes;
//


function getExportPath(path, result, filePath) {
  let node = path.node;
  if (node.source && (node.source.type === 'StringLiteral' || node.source.type === 'Literal')) {
    result.push({
      fileName: node.source.value,
      filePath: filePath
    });
  }

  const fileName = node.declaration && (node.declaration.id?.name || node.declaration.name);
  if (fileName) {
    result.push({
      fileName: fileName,
      filePath: filePath
    });
  }
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

function findFromImport(files, filePath, result = []) {
  const fileName = validFile(files, filePath);
  const ast = fileName && astHelper.flowAst(fileName?.code);
  if (ast) {
    recast.visit(ast, {
      visitImportDeclaration: function(path) {
        getImportPath(path, (p) => {
          findExports(files, p.slice(1), result);
        });
        this.traverse(path);
      }
    });
  }
}


function findExports(files, filePath = '/index.js', result = []) {
  const fileName = validFile(files, filePath);
  const ast = astHelper.flowAst(fileName?.code);
  if (ast) {
    recast.visit(ast, {
      visitExportAllDeclaration: function(path) {
        getExportPath(path, result, filePath);
        this.traverse(path);
      },
      visitExportNamedDeclaration: function(path) {
        getExportPath(path, result, filePath);
        this.traverse(path);
      },
      visitExportDefaultDeclaration: function(path) {
        getExportPath(path, result, filePath);
        this.traverse(path);
      },
    });
  }

  if (result.length <= 0) {
    findFromImport(files, filePath, result);
  }
  return result;
}

module.exports = {
  validFile, findExports
};
