const fs = require('fs');
const jsData = fs.readFileSync('e:/AI Sites Practice/3d Car Site/assets/models/car-model-data.js', 'utf8');
console.log('JS Data file size:', jsData.length);
// Extract by eval or slicing
global.window = {};
eval(jsData);
console.log('window.CAR_MODEL_BASE64 exists:', typeof window.CAR_MODEL_BASE64 === 'string');
console.log('Length:', window.CAR_MODEL_BASE64.length);
const buf = Buffer.from(window.CAR_MODEL_BASE64, 'base64');
console.log('Decoded buffer size:', buf.length);
console.log('Header magic:', buf.toString('ascii', 0, 4));
console.log('glTF version:', buf.readUInt32LE(4));
