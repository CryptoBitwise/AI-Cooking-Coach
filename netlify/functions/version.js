exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      version: 'v1.2.0',
      timestamp: new Date().toISOString(),
      hasApiKey: !!(process.env.GOOGLE_AI_API_KEY || process.env.REACT_APP_GOOGLE_AI_API_KEY),
      apiKeySource: process.env.GOOGLE_AI_API_KEY ? 'GOOGLE_AI_API_KEY' : process.env.REACT_APP_GOOGLE_AI_API_KEY ? 'REACT_APP_GOOGLE_AI_API_KEY' : 'none'
    })
  };
};
