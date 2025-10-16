# Simple Chatbot with Azure OpenAI

A minimal chatbot that uses Azure OpenAI GPT API, deployed on Vercel.

## Files Created

- `index.html` - Simple chatbot interface
- `api/chat.js` - Vercel serverless function for Azure API
- `package.json` - Node.js configuration
- `vercel.json` - Vercel deployment configuration

## How to Deploy on Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure Environment Variables** (IMPORTANT!)

### Step 3: Set Up API Keys in Vercel

**In your Vercel project dashboard:**

1. Go to **Settings** → **Environment Variables**
2. Add these 3 variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `AZURE_OPENAI_ENDPOINT` | `https://your-resource.openai.azure.com/` | Your Azure OpenAI endpoint URL |
| `AZURE_OPENAI_API_KEY` | `your-api-key-here` | Your Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | `gpt-4` or `gpt-35-turbo` | Your deployment name |

**Example values:**
```
AZURE_OPENAI_ENDPOINT = https://myopenai.openai.azure.com/
AZURE_OPENAI_API_KEY = abc123def456ghi789
AZURE_OPENAI_DEPLOYMENT_NAME = gpt-4
```

3. **Click "Save"** for each variable
4. **Go to Deployments** and click **"Redeploy"**

### Step 4: Test Your Chatbot

Your chatbot will be available at: `https://your-project-name.vercel.app`

## Getting Azure OpenAI Credentials

1. **Create Azure OpenAI Resource:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Azure OpenAI" resource
   - Note the endpoint URL

2. **Deploy a Model:**
   - Go to Azure OpenAI Studio
   - Create a new deployment (GPT-4 or GPT-3.5-turbo)
   - Note the deployment name

3. **Get API Key:**
   - In Azure Portal → Your OpenAI resource → Keys and Endpoint
   - Copy Key 1 or Key 2

## Local Development (Optional)

### Method 1: Simple Express Server (Recommended for testing)

```bash
# Install dependencies
npm install

# Create .env file for local testing
echo "AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/" > .env
echo "AZURE_OPENAI_API_KEY=your-api-key-here" >> .env
echo "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" >> .env

# Start the server
npm start
# or
node server.js
```

Then visit: `http://localhost:3000`

### Method 2: Vercel CLI (For production-like testing)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Create .env.local file
echo "AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/" > .env.local
echo "AZURE_OPENAI_API_KEY=your-api-key-here" >> .env.local
echo "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" >> .env.local

# Run locally with Vercel
npm run vercel-dev
```

## Troubleshooting

- **"Server configuration error"**: Check that all 3 environment variables are set in Vercel
- **"Failed to get AI response"**: Verify your Azure API key and deployment name
- **CORS errors**: The API includes CORS headers, should work automatically

## Security Notes

✅ **API keys are stored securely** in Vercel environment variables  
✅ **No sensitive data** in your GitHub repository  
✅ **HTTPS enabled** automatically by Vercel
