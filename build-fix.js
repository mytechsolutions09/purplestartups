const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Search for any file that imports uuid
function findUuidImports() {
  const result = execSync('grep -r "from \'uuid\'" src || true', { encoding: 'utf8' });
  return result.split('\n').filter(line => line.trim() !== '');
}

// Fix all found files
const files = findUuidImports();
console.log(`Found ${files.length} files with uuid imports`);

files.forEach(line => {
  const filePath = line.split(':')[0];
  console.log(`Fixing ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the uuid import
  content = content.replace(
    /import\s+.*\s+from\s+['"]uuid['"];?/g,
    'import { generateUUID } from "../utils/uuid";'
  );
  
  // Replace uuid usage
  content = content.replace(/uuidv4\(\)/g, 'generateUUID()');
  content = content.replace(/uuid\.v4\(\)/g, 'generateUUID()');
  
  fs.writeFileSync(filePath, content);
});

// Now run the build
console.log('Running build...');
execSync('npm run build', { stdio: 'inherit' }); 