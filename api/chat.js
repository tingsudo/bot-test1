export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Azure OpenAI credentials from environment variables
  const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY;
  const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

  // Validate environment variables
  if (!azureOpenAIEndpoint || !azureOpenAIKey) {
    console.error('Missing Azure OpenAI credentials');
    return res.status(500).json({ 
      error: 'Server configuration error. Please contact support.' 
    });
  }

  try {
    // Get messages from request body
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // Construct Azure OpenAI API URL
    const apiUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIDeployment}/chat/completions?api-version=2024-02-15-preview`;

    // Call Azure OpenAI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIKey
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI service',
        details: errorText
      });
    }

    const data = await response.json();
    
    // Return the response in the same format as before
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

