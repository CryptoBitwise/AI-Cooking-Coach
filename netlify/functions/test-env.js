exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      hasApiKey: !!process.env.GOOGLE_AI_API_KEY,
      apiKeyLength: process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.length : 0,
      apiKeyPrefix: process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.substring(0, 10) + '...' : 'undefined',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('API'))
    })
  };
};
