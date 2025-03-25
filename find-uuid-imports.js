const fs = require('fs');
const path = require('path');

function searchFilesForString(dir, searchString, fileExtensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      searchFilesForString(filePath, searchString, fileExtensions);
    } else if (fileExtensions.includes(path.extname(filePath))) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchString)) {
        console.log(`Found "${searchString}" in: ${filePath}`);
      }
    }
  });
}

// Start searching from the src directory
searchFilesForString('./src', 'uuid'); 