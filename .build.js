const fs = require('fs');
const path = require('path');

const lib_path = path.join(__dirname, './dist/lib');
const files = [
  ['./didkit.browser.d.ts', './didkit.d.ts'],
  ['./didkit.browser.js', './didkit.js'],
];

files.forEach(([from, to]) => {
  const f = fs.createReadStream(path.join(lib_path, from));
  const t = fs.createWriteStream(path.join(lib_path, to));
  f.pipe(t);
  console.log(lib_path, from, to);
});
