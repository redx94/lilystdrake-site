#!/bin/bash
set -e

echo "Deploying Lily St. Drake website..."

# Load token from local env file if exists
if [ -f .env ]; then
  source .env
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "ERROR: CLOUDFLARE_API_TOKEN not set"
  echo "Set with:"
  echo "  echo 'CLOUDFLARE_API_TOKEN=\"your_token\"' > .env"
  exit 1
fi

cd public
npx wrangler pages deploy . --project-name=lilystdrake --branch production

echo ""
echo "Done! https://lilystdrake.com"
