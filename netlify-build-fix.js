const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Netlify build fix process...');

// Clean up any existing version files that might have encoding issues
try {
  if (fs.existsSync('.nvmrc')) fs.unlinkSync('.nvmrc');
  if (fs.existsSync('.node-version')) fs.unlinkSync('.node-version');
  if (fs.existsSync('.python-version')) fs.unlinkSync('.python-version');
  console.log('Cleaned up existing version files');
} catch (err) {
  console.warn('Warning when cleaning files:', err.message);
}

// Write clean version files with proper UTF-8 encoding
fs.writeFileSync('.nvmrc', '18.19.0\n', {encoding: 'utf8'});
fs.writeFileSync('.node-version', '18.19.0\n', {encoding: 'utf8'});
fs.writeFileSync('.python-version', '3.9.0\n', {encoding: 'utf8'});
fs.writeFileSync('runtime.txt', '3.9.0\n', {encoding: 'utf8'});
console.log('Created fresh version files with UTF-8 encoding');

// Function to ensure utils/uuid.ts exists
function ensureUuidUtilExists() {
  const uuidFile = path.join(process.cwd(), 'src', 'utils', 'uuid.ts');
  const uuidContent = `export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
`;
  
  console.log(`Ensuring UUID utility exists at: ${uuidFile}`);
  fs.mkdirSync(path.dirname(uuidFile), { recursive: true });
  fs.writeFileSync(uuidFile, uuidContent);
}

// Fix any files with UUID imports
function fixUuidImports() {
  const contextFile = path.join(process.cwd(), 'src', 'contexts', 'SavedPlansContext.tsx');
  
  if (fs.existsSync(contextFile)) {
    console.log(`Checking ${contextFile} for UUID imports...`);
    let content = fs.readFileSync(contextFile, 'utf8');
    
    if (content.includes('from "uuid"') || content.includes("from 'uuid'")) {
      console.log('Found UUID import, replacing with local utility...');
      
      // Replace the import
      content = content.replace(
        /import\s+.*\s+from\s+['"]uuid['"];?/g,
        'import { generateUUID } from "../utils/uuid";'
      );
      
      // Replace uuid usage
      content = content.replace(/uuidv4\(\)/g, 'generateUUID()');
      content = content.replace(/uuid\.v4\(\)/g, 'generateUUID()');
      
      fs.writeFileSync(contextFile, content);
      console.log('Fixed UUID imports in SavedPlansContext.tsx');
    }
  }
}

// Fix for crypto getRandomValues on Netlify
if (typeof window === 'undefined' && !global.crypto) {
  const crypto = require('crypto');
  global.crypto = {
    getRandomValues: (arr) => crypto.randomFillSync(arr)
  };
}

// Only fix UUID imports, don't run npm commands
try {
  ensureUuidUtilExists();
  fixUuidImports();
  console.log('UUID fixes applied successfully!');
} catch (error) {
  console.error('Error during UUID fix process:', error);
  // Don't exit with error - let the build continue
} 