const express = require('express');
const path = require('path');
const fs = require('fs');

// Load environment variables from file
function loadEnvFile() {
  try {
    const envFile = fs.readFileSync('env.local', 'utf8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
    console.log('Environment variables loaded from env.local');
  } catch (error) {
    console.log('No env.local file found, using system environment variables');
  }
}

loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Test API endpoint
app.get('/api/chat', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    method: req.method 
  });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get environment variables
    const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
    const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
    const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    console.log('Environment check:', {
      hasEndpoint: !!AZURE_ENDPOINT,
      hasApiKey: !!AZURE_API_KEY,
      hasDeployment: !!AZURE_DEPLOYMENT
    });

    if (!AZURE_ENDPOINT || !AZURE_API_KEY || !AZURE_DEPLOYMENT) {
      console.error('Missing Azure OpenAI environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing environment variables'
      });
    }

    // Call Azure OpenAI API
    const response = await fetch(
      `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API error:', errorText);
      return res.status(500).json({ 
        error: 'Failed to get AI response',
        details: errorText
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test API at http://localhost:${PORT}/api/chat`);
});
