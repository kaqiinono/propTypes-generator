const { validFile, findExports, generate } = require('./actions/finalExport');

module.exports = {
  generate, findExports, validFile
};


// const path = require('path');
const fs = require('fs');
// const srcCode = fs.readFileSync(path.resolve(__dirname,'./Button.jsx'));
const { files } = require('./files.json');
const result = [];
findExports(files, '/index.js', result);
console.log(result);
result.forEach(r => {
  const ret = {};
  generate(validFile(files, r.filePath)?.code, r.fileName).then(d => fs.writeFileSync('./RESULT.json', JSON.stringify(d)))
});
