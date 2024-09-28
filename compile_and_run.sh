#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

# Install dependencies
npm install

# Build the SvelteKit project
npm run build

# Navigate to the server directory
cd server

# Install server dependencies
npm install

