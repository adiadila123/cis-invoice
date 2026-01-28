---
description: Deploy CIS Invoice Calculator to GitHub and Vercel
---

# Deploy to GitHub and Vercel

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - Repository name: `cis-invoice-calculator` (or your preferred name)
   - Description: "CIS Invoice Calculator - Bilingual invoice generator for UK contractors"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Import your GitHub repository (`cis-invoice-calculator`)
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)
6. Click "Deploy"
7. Wait for deployment to complete (usually 1-2 minutes)
8. Your app will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build fails on Vercel
- Check that all dependencies are in `package.json`
- Ensure build command is `npm run build`
- Check build logs for specific errors

### App doesn't load after deployment
- Verify the output directory is set to `dist`
- Check browser console for errors
- Ensure all environment variables are set (if any)

## Next Steps

- Set up automatic deployments (Vercel does this by default)
- Add custom domain
- Monitor analytics in Vercel dashboard
- Share your invoice calculator with others!
