# 🌿 LILY ST. DRAKE - Website Documentation

## Overview

This is the official website for Lily St. Drake, a professional drag artist.

## Deployment

### Manual Deploy
```bash
cd /path/to/lilystdrake-site-new
export CLOUDFLARE_PAGES_TOKEN="your_pages_token_here"
npx wrangler pages deploy public --project-name=lilystdrake
```

### GitHub Actions
1. Go to: https://github.com/redx94/lilystdrake-site/settings/secrets
2. Add secret: `CLOUDFLARE_PAGES_TOKEN` with your Cloudflare Pages deploy token
3. Push to main - deployment happens automatically!

## GitHub Actions Workflow

The workflow file (.github/workflows/deploy.yml) handles automatic deployment to Cloudflare Pages when code is pushed to main.

## Project Structure

```
lilystdrake-site-new/
├── public/           # Website files
├── .github/         # CI/CD workflows
├── deploy.sh        # Deploy script
├── wrangler.toml    # Cloudflare config
└── README.md        # This file
```

## Live Site
https://lilystdrake.com