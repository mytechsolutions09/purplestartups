const fs = require('fs');
const { execSync } = require('child_process');

// Write the correct Node version to .nvmrc
fs.writeFileSync('.nvmrc', '16\n');
console.log('Created .nvmrc with Node 16');

// Fix uuid utility
require('./netlify-build-plugin');

// Run the build
console.log('Running build command...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 