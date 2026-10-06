const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const scriptMatches = html.match(/src="[^"]+"/g) || [];

console.log('Validating scripts in index.html:');
let allOk = true;

scriptMatches.forEach(tag => {
  const src = tag.slice(5, -1);
  const fullPath = path.join(__dirname, '..', src);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  console.log(` - ${src.padEnd(38)}: ${exists ? 'OK (' + size + ' bytes)' : 'FAIL: NOT FOUND'}`);
  if (!exists) allOk = false;
});

const cssMatches = html.match(/href="[^"]+\.css"/g) || [];
console.log('\nValidating stylesheets in index.html:');
cssMatches.forEach(tag => {
  const href = tag.slice(6, -1);
  const fullPath = path.join(__dirname, '..', href);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  console.log(` - ${href.padEnd(38)}: ${exists ? 'OK (' + size + ' bytes)' : 'FAIL: NOT FOUND'}`);
  if (!exists) allOk = false;
});

console.log('\nResult: ' + (allOk ? 'ALL ASSETS VERIFIED SUCCESSFULLY!' : 'SOME ASSETS ARE MISSING!'));
