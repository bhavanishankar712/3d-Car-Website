const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const jsFiles = [
  'main.js',
  'car.js',
  'explosion.js',
  'showroom.js',
  'lights.js',
  'camera.js',
  'configurator.js',
  'interaction.js'
];

console.log('Checking JavaScript syntax:');
jsFiles.forEach(file => {
  const fullPath = path.join(__dirname, '../js', file);
  try {
    execSync(`node -c "${fullPath}"`);
    console.log(` - ${file.padEnd(20)}: SYNTAX OK`);
  } catch (err) {
    console.error(` - ${file.padEnd(20)}: SYNTAX ERROR!`, err.message);
  }
});
