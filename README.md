# HerPower Chat Application

A communication coaching chatbot application deployed on Vercel.

## Setup for Vercel Deployment

### 1. Environment Variables

Before deploying to Vercel, you need to configure the following environment variables in your Vercel project settings:

- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint (e.g., `https://your-resource.openai.azure.com`)
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT_NAME`: (Optional) Your deployment name (defaults to `gpt-4`)

### 2. How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI resource endpoint
   - `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
   - `AZURE_OPENAI_DEPLOYMENT_NAME`: (Optional) Your deployment name

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Architecture

- **Frontend**: Static HTML/CSS/JavaScript files
- **API**: Vercel serverless function at `/api/chat.js` that proxies requests to Azure OpenAI
- **Credentials**: Stored securely as environment variables in Vercel

## Local Development

For local development, create a `.env.local` file with your Azure credentials:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

Then run:

```bash
vercel dev
```

## Notes

- The application no longer depends on Azure API Management
- All Azure OpenAI credentials are stored as environment variables
- The API endpoint is now a Vercel serverless function that securely proxies requests to Azure OpenAI
