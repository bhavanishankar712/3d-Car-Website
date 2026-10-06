const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '../assets/models/car.glb');
const outPath = path.join(__dirname, '../assets/models/car-model-data.js');

console.log('Reading:', glbPath);
const buf = fs.readFileSync(glbPath);
console.log('GLB file size:', buf.length, 'bytes');

const b64 = buf.toString('base64');
console.log('Base64 length:', b64.length, 'characters');

const header = '/**\n * Pre-bundled 3D Lamborghini Model for Pure HTML file:// standalone execution\n */\nwindow.CAR_MODEL_BASE64 = ';
const stream = fs.createWriteStream(outPath);
stream.write(header);
stream.write(JSON.stringify(b64));
stream.write(';\n');
stream.end(() => {
  console.log('Successfully generated:', outPath);
  console.log('File size:', fs.statSync(outPath).size, 'bytes');
});
