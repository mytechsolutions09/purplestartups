#!/bin/bash
# Fix for .nvmrc file issues
echo "16" > .nvmrc
echo "Using Node.js version: 16"
# Set Python version explicitly
export PYTHON_VERSION=3.9.13
echo "Using Python version: $PYTHON_VERSION"
# Run the actual build
npm run build 