#!/bin/bash
# Remove uuid from node_modules to prevent any imports
rm -rf node_modules/uuid
# Install dependencies
npm ci
# Run the prebuild script to fix imports
node scripts/fix-import.js
# Build the application
npm run build 