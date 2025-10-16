export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test endpoint - GET request
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      method: req.method 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}