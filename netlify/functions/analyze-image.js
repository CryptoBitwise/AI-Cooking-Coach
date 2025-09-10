const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { imageData, currentStep } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image data is required' })
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Convert base64 to proper format for Gemini
    const base64Data = imageData.split(',')[1];

    let prompt = '';
    if (currentStep === 'ingredients') {
      prompt = `Analyze this image of ingredients and suggest a delicious recipe. 
Please provide:
1. List of ingredients you can identify
2. A complete recipe with steps
3. Estimated cooking time
4. Difficulty level
5. Nutritional highlights

Respond in JSON format:
{
  "ingredients": ["ingredient1", "ingredient2"],
  "recipe": {
    "name": "Recipe Name",
    "steps": ["step1", "step2"],
    "cookingTime": "30 minutes",
    "difficulty": "Easy",
    "nutrition": "High in protein, low in carbs"
  }
}`;
    } else if (currentStep === 'cooking') {
      prompt = `Analyze this cooking progress photo and provide feedback.
Is this step completed correctly? What should the user do next?

Respond in JSON format:
{
  "feedback": "Detailed feedback about the cooking progress",
  "nextStep": "What to do next",
  "looksgood": true/false,
  "tips": ["tip1", "tip2"]
}`;
    } else {
      prompt = `Analyze this finished dish photo and provide a comprehensive evaluation.

Respond in JSON format:
{
  "overallScore": 4.2,
  "socialMediaWorthy": true,
  "presentation": {
    "score": 4.5,
    "strengths": ["Beautiful plating", "Great color contrast"],
    "improvements": ["Add garnish", "Better lighting"]
  },
  "cookingQuality": {
    "score": 4.0,
    "assessment": "Well-cooked with good technique"
  },
  "nutrition": {
    "estimatedCalories": "450-500",
    "healthScore": 4.2,
    "macros": "High protein, moderate carbs, good fats"
  },
  "compliments": "Excellent work! This looks restaurant-quality.",
  "improvementTips": ["Try adding fresh herbs", "Consider plating height"]
}`;
    }

    // Call Google AI Studio API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    let responseText = data.candidates[0].content.parts[0].text;

    // Clean up response and parse JSON
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysisData = JSON.parse(responseText);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(analysisData)
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to analyze image' })
    };
  }
};
