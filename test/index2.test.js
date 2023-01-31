// const path = require('path');
const fs = require('fs');
const { readFileList } = require('./props-gen.js');
const { validFile, generate, findExports } = require('../actions/finalExport.js');

const files = {};

readFileList(
  '/Users/songmeinuo/Documents/coding/public/propTypes-generator/test/template',
  '/Users/songmeinuo/Documents/coding/public/propTypes-generator/test/template',
  files);

console.log('files',files);

const result = findExports(files, '/src/index.js');
console.log(result);
result.forEach(r => {
  const ret = {};
  generate(validFile(files, r.filePath)?.code, r.fileName).then(d => {
    fs.writeFileSync('./RESULT.json', JSON.stringify(d));
  });
});
