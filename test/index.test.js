// const path = require('path');
const fs = require('fs');
const { validFile, generate, findExports } = require('../actions/finalExport.js');

// const srcCode = fs.readFileSync(path.resolve(__dirname,'./Button.jsx'));
const { files } = require('./files.json');
const result = findExports(files, '/index.js');
console.log('result', result);
result.forEach(r => {
  const ret = {};
  generate(validFile(files, r.filePath)?.code, r.fileName).then(d => {
    fs.writeFileSync('./RESULT.json', JSON.stringify(d));
  });
});
