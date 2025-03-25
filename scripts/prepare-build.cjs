const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log with timestamps
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Platform-independent directory removal
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    log(`Removing directory: ${dirPath}`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      log(`Successfully removed ${dirPath}`);
    } catch (err) {
      log(`Error removing directory: ${err.message}`);
      // Fallback for older Node versions
      try {
        if (process.platform === 'win32') {
          execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'inherit' });
        } else {
          execSync(`rm -rf "${dirPath}"`, { stdio: 'inherit' });
        }
        log(`Successfully removed ${dirPath} using exec`);
      } catch (execErr) {
        log(`Failed to remove directory via exec: ${execErr.message}`);
      }
    }
  } else {
    log(`Directory does not exist: ${dirPath}`);
  }
}

// Step 1: Remove uuid from node_modules
log('Step 1: Removing uuid from node_modules');
const uuidPath = path.join(process.cwd(), 'node_modules', 'uuid');
removeDir(uuidPath);

// Step 2: Update package.json to remove uuid dependency
log('Step 2: Updating package.json to remove uuid dependency');
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.uuid) {
    log('Removing uuid from dependencies');
    delete packageJson.dependencies.uuid;
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies['@types/uuid']) {
    log('Removing @types/uuid from devDependencies');
    delete packageJson.devDependencies['@types/uuid'];
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('Successfully updated package.json');
} catch (err) {
  log(`Error updating package.json: ${err.message}`);
}

// Step 3: Run the import fix script to fix all uuid imports
log('Step 3: Running import fix script');
try {
  require('./fix-import.cjs');
  log('Successfully ran fix-import.cjs');
} catch (err) {
  log(`Error running fix-import.cjs: ${err.message}`);
}

// Step 4: Clean npm cache if on Netlify
if (process.env.NETLIFY) {
  log('Step 4: Cleaning npm cache on Netlify');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    log('Successfully cleaned npm cache');
  } catch (err) {
    log(`Error cleaning npm cache: ${err.message}`);
  }
}

log('Build preparation completed'); 