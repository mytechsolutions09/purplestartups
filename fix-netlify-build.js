const fs = require('fs');
const { execSync } = require('child_process');

console.log('Starting Netlify build fix process...');

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Directly fix the file with the issue
const contextFile = 'src/contexts/SavedPlansContext.tsx';
console.log(`Fixing ${contextFile}...`);

try {
  // Read the file content
  let content = fs.readFileSync(contextFile, 'utf8');
  
  // Check for the import
  if (content.includes('from "uuid"') || content.includes("from 'uuid'")) {
    console.log('Found uuid import, replacing...');
    
    // Replace any uuid import and make sure generateUUID is imported
    content = content.replace(
      /import.*from\s+['"]uuid['"];?/g, 
      '// uuid import removed'
    );
    
    // Make sure the generateUUID import is present
    if (!content.includes('import { generateUUID }')) {
      content = content.replace(
        'import React',
        'import { generateUUID } from "../utils/uuid";\nimport React'
      );
    }
    
    // Replace any uuidv4() calls
    content = content.replace(/uuidv4\(\)/g, 'generateUUID()');
    content = content.replace(/uuid\.v4\(\)/g, 'generateUUID()');
    
    fs.writeFileSync(contextFile, content);
    console.log('Successfully updated file');
  } else {
    console.log('No uuid import found - checking for other issues');
  }
  
  // Make sure the uuid.ts file exists and has the right content
  const uuidFile = 'src/utils/uuid.ts';
  const uuidContent = `export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
`;
  
  console.log(`Ensuring ${uuidFile} exists with correct content...`);
  fs.mkdirSync('src/utils', { recursive: true });
  fs.writeFileSync(uuidFile, uuidContent);
  
  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
} 