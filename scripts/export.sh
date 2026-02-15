#!/bin/bash

# Exit on error
set -e

echo "Building project..."
npm run build

echo "Creating export directory..."
mkdir -p export

echo "Copying files to export directory..."
cp main.js manifest.json styles.css export/

echo "Export complete! Files are in the 'export' folder."
ls -l export
