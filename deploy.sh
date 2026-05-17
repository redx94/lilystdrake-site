#!/bin/bash
# LILY ST. DRAKE - DEPLOYMENT SCRIPT
# 
# Usage: 
#   export CLOUDFLARE_PAGES_TOKEN="your_token"
#   ./deploy.sh

set -e

echo "Deploying Lily St. Drake website..."

# Check for token
if [ -z "$CLOUDFLARE_PAGES_TOKEN" ]; then
    echo "ERROR: CLOUDFLARE_PAGES_TOKEN not set"
    echo "Set with: export CLOUDFLARE_PAGES_TOKEN='your_token'"
    exit 1
fi

# Push to GitHub
git add -A
git commit -m "Deploy update" 2>/dev/null || true
git push origin main

# Deploy to Cloudflare
cd public
npx wrangler pages deploy . --project-name=lilystdrake

echo "Done! https://lilystdrake.com"