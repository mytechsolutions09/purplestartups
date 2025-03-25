const fs = require('fs');
const path = require('path');

// Function to recursively find files
function findFiles(dir, extension) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recurse into subdirectories, but skip node_modules
        if (file !== 'node_modules' && file !== 'dist') {
          results = results.concat(findFiles(filePath, extension));
        }
      } else if (path.extname(file) === extension) {
        results.push(filePath);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  
  return results;
}

// Get the relative path to utils/uuid.ts from a file
function getRelativePath(fromFilePath) {
  const projectRoot = process.cwd();
  const relativeFromPath = path.relative(projectRoot, fromFilePath);
  const fromDir = path.dirname(relativeFromPath);
  
  // Calculate the relative path from the file to utils/uuid.ts
  const uuidPath = path.join('src', 'utils', 'uuid');
  const relativePath = path.relative(fromDir, uuidPath).replace(/\\/g, '/');
  
  // If not starting with ./ or ../, add ./
  return relativePath.startsWith('.') ? relativePath : './' + relativePath;
}

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't actually use uuid
    if (!content.includes('uuid')) {
      return;
    }
    
    console.log(`Checking ${filePath} for uuid imports`);
    
    // Look for any import from 'uuid'
    const uuidImportRegex = /import\s+(?:{?\s*v4\s+as\s+uuidv4\s*}?|\*\s+as\s+uuid|.*?)\s+from\s+['"]uuid['"];?/g;
    
    if (uuidImportRegex.test(content)) {
      console.log(`Found uuid import in ${filePath}`);
      
      // Calculate the relative path to utils/uuid
      const relativePath = getRelativePath(filePath);
      
      // Replace the import with our local implementation
      content = content.replace(
        uuidImportRegex,
        `import { generateUUID } from '${relativePath}';`
      );
      
      // Replace any uuidv4() calls with generateUUID()
      content = content.replace(/uuidv4\(\)/g, 'generateUUID()');
      content = content.replace(/uuid\.v4\(\)/g, 'generateUUID()');
      
      // Write the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed uuid imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main execution
console.log('Looking for TypeScript and JavaScript files...');
const tsFiles = findFiles('./src', '.ts').concat(findFiles('./src', '.tsx'));
const jsFiles = findFiles('./src', '.js').concat(findFiles('./src', '.jsx'));
const allFiles = tsFiles.concat(jsFiles);

console.log(`Found ${allFiles.length} files to check`);
allFiles.forEach(fixImports);
console.log('Import fixing completed'); 