// This file helps fix the UUID import issues during Netlify builds
const fs = require('fs');
const path = require('path');

// Ensure the UUID utility file exists
const uuidUtilPath = path.join(__dirname, 'src', 'utils', 'uuid.ts');
const uuidUtilContent = `
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
`;

// Make sure the directory exists
if (!fs.existsSync(path.dirname(uuidUtilPath))) {
  fs.mkdirSync(path.dirname(uuidUtilPath), { recursive: true });
}

// Write the UUID utility file
fs.writeFileSync(uuidUtilPath, uuidUtilContent);

console.log('UUID utility file created successfully'); 