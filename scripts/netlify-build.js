const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log function
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Read the content of SavedPlansContext.tsx
const contextFilePath = path.join(process.cwd(), 'src', 'contexts', 'SavedPlansContext.tsx');
log(`Reading file: ${contextFilePath}`);

try {
  // Read the file content
  let content = fs.readFileSync(contextFilePath, 'utf8');
  log('Successfully read file');
  
  // Check if the file contains 'uuid' import
  if (content.includes('from \'uuid\'') || content.includes('from "uuid"')) {
    log('Found uuid import, replacing it...');
    
    // Replace any uuid import with our own implementation
    content = content.replace(
      /import\s+[^;]+\s+from\s+['"]uuid['"];?/g,
      '// uuid import replaced with local implementation'
    );
    
    // Make sure generateUUID is imported
    if (!content.includes('import { generateUUID }')) {
      content = content.replace(
        /import React/,
        'import { generateUUID } from \'../utils/uuid\';\nimport React'
      );
    }
    
    // Replace any uuidv4() calls
    content = content.replace(/uuidv4\(\)/g, 'generateUUID()');
    content = content.replace(/uuid\.v4\(\)/g, 'generateUUID()');
    
    // Write the updated content back to the file
    fs.writeFileSync(contextFilePath, content);
    log('Successfully updated SavedPlansContext.tsx');
  } else {
    log('No uuid import found in the file');
  }
  
  // Now let's make sure uuid is not in package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  log(`Updating package.json at ${packageJsonPath}`);
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies.uuid) {
    delete packageJson.dependencies.uuid;
    log('Removed uuid from dependencies');
  }
  if (packageJson.devDependencies && packageJson.devDependencies['@types/uuid']) {
    delete packageJson.devDependencies['@types/uuid'];
    log('Removed @types/uuid from devDependencies');
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('Updated package.json');
  
  // Run the build
  log('Starting the build process...');
  execSync('npm run build', { stdio: 'inherit' });
  log('Build completed successfully!');
} catch (error) {
  log(`Error: ${error.message}`);
  process.exit(1);
} 