// Apply crypto polyfill immediately
if (typeof window === 'undefined' && !global.crypto) {
  const crypto = require('crypto');
  global.crypto = {
    getRandomValues: function(buffer) {
      // Ensure we're dealing with a Uint8Array or similar
      if (!(buffer instanceof Uint8Array) && buffer.BYTES_PER_ELEMENT) {
        buffer = new Uint8Array(buffer.buffer);
      }
      return crypto.randomFillSync(buffer);
    }
  };
  console.log('Applied crypto polyfill');

  // Also patch globalThis for extra safety
  if (typeof globalThis !== 'undefined' && !globalThis.crypto) {
    globalThis.crypto = global.crypto;
  }
}

// Now run the build process
const { execSync } = require('child_process');

try {
  console.log('Starting Vite build...');
  // Run with NODE_OPTIONS if needed
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--max-old-space-size=4096';
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 