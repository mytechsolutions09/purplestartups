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
fs.writeFileSync('.nvmrc', '16\n', {encoding: 'utf8'});
fs.writeFileSync('.node-version', '16\n', {encoding: 'utf8'});
fs.writeFileSync('.python-version', '3.9\n', {encoding: 'utf8'});
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

// Main execution
try {
  ensureUuidUtilExists();
  fixUuidImports();
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build process:', error);
  process.exit(1);
} 