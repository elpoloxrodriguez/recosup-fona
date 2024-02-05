const fs = require('fs');
const buildDateTime = new Date().toString();

// Actualiza environment.prod.ts
const environmentProdFilePath = 'src/environments/environment.prod.ts';
let environmentProdFileContent = fs.readFileSync(environmentProdFilePath, 'utf8');
environmentProdFileContent = environmentProdFileContent.replace(/buildDateTime: '.*'/, `buildDateTime: '${buildDateTime}'`);
fs.writeFileSync(environmentProdFilePath, environmentProdFileContent, 'utf8');

// Actualiza environment.ts
const environmentFilePath = 'src/environments/environment.ts';
let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf8');
environmentFileContent = environmentFileContent.replace(/buildDateTime: '.*'/, `buildDateTime: '${buildDateTime}'`);
fs.writeFileSync(environmentFilePath, environmentFileContent, 'utf8');
