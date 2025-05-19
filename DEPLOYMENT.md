# 🚀 Deploying AI Prompt Dashboard to Cloudflare Pages

This guide will walk you through deploying the AI Prompt Dashboard to Cloudflare Pages, allowing you to access your prompts from anywhere.

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (optional, for local testing)
3. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Options

### Option 1: GitHub Actions Workflow (Recommended)

This repository includes a GitHub Actions workflow that automatically deploys to Cloudflare Pages when changes are pushed to the main branch.

1. **Set up Cloudflare API tokens**:
   - Log in to your Cloudflare dashboard
   - Navigate to "My Profile" > "API Tokens"
   - Create a new token with the "Edit Cloudflare Pages" template
   - Copy the token value

2. **Add repository secrets**:
   - Go to your GitHub repository
   - Navigate to "Settings" > "Secrets and variables" > "Actions"
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (found in the dashboard URL)

3. **Trigger deployment**:
   - Push changes to the `main` branch
   - The workflow will automatically build and deploy your application
   - Check the "Actions" tab in your GitHub repository for deployment status
   - Once complete, you'll receive a URL to access your application (e.g., `https://ai-prompt-dashboard.pages.dev`)

### Option 2: Direct GitHub Integration

1. **Connect your GitHub repository to Cloudflare Pages**:
   - Log in to your Cloudflare dashboard
   - Navigate to "Pages"
   - Click "Create a project"
   - Select "Connect to Git"
   - Authorize Cloudflare to access your GitHub account
   - Select the `prompt-dashboard` repository

2. **Configure build settings**:
   - **Project name**: `ai-prompt-dashboard` (or your preferred name)
   - **Production branch**: `main` (or your default branch)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` (or latest LTS)

3. **Add environment variables** (if needed):
   - No environment variables are required for basic functionality
   - For custom Supabase integration, you can configure it in the app settings

4. **Deploy**:
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your application
   - Once complete, you'll receive a URL to access your application (e.g., `https://ai-prompt-dashboard.pages.dev`)

### Option 3: Manual Deployment with Wrangler

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Log in to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build your project**:
   ```bash
   npm run build
   ```

4. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages deploy dist
   ```

5. **Follow the prompts** to complete the deployment.

## Post-Deployment Configuration

### Custom Domain (Optional)

1. In your Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Follow the instructions to add your domain

### Supabase Configuration

The application allows you to configure Supabase directly in the UI:

1. Access your deployed application
2. Click the settings icon in the top-right corner
3. Select "Supabase" or "Both" as your storage option
4. Enter your Supabase project URL and anon key
5. Click "Save"

## Updating Your Deployment

### With GitHub Integration

Simply push changes to your connected GitHub repository. Cloudflare will automatically build and deploy the updates.

### With Wrangler

1. Make your changes
2. Build the project: `npm run build`
3. Deploy the updates: `wrangler pages deploy dist`

## Troubleshooting

### Build Failures

If your build fails, check the build logs in the Cloudflare dashboard for specific errors.

Common issues:
- Node.js version compatibility
- Missing dependencies
- Build script errors

### Runtime Errors

If the application deploys but doesn't work correctly:

1. Check browser console for errors
2. Verify Supabase connection settings
3. Ensure Content Security Policy in `wrangler.toml` allows all required connections

### CORS Issues

If you experience CORS issues with Supabase or the Pollinations API:

1. Verify the Content Security Policy in `wrangler.toml`
2. Update the `connect-src` directive if needed

## Security Considerations

- The application stores data in browser localStorage by default, which is secure and private
- When using Supabase, ensure you're using the anon key (not the service key)
- Consider enabling user authentication for additional security

## Need Help?

If you encounter any issues with your Cloudflare Pages deployment, refer to the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) or reach out to [Pink Pixel](https://pinkpixel.dev) for assistance.

---

Made with ❤️ by Pink Pixel
