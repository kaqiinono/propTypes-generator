const fs = require('fs-extra');
const path = require('path');

function readFileList(root = process.cwd(), dir, filesList = {}) {
  console.log('dir====>', dir);
  const files = fs.readdirSync(dir);
  files.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = dir.replace(root, '');
    if (!(/\/(dist|.jcode|public|node_modules|build)/.test(relativePath))) {
      if (stat.isDirectory()) {
        readFileList(root, path.join(dir, item), filesList); //递归读取文件
      } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
        console.log('fullPath', fullPath);
        filesList[fullPath.replace(root, '')] = {
          path: fullPath,
          relativePath,
          code: fs.readFileSync(fullPath).toString(),
        };
      }
    }
  });
  return filesList;
}

module.exports = {
  readFileList
};
