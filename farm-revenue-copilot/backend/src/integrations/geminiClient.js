'use strict';

/**
 * integrations/geminiClient.js
 * Gemini AI integration for farmer advisory chatbot.
 * Uses Google's Gemini API for conversational AI support.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// System prompt for the AI advisor
const SYSTEM_PROMPT = `You are AnnaVriddhi's Agri Advisor — an expert agricultural advisor for Indian farmers. You are embedded in the AnnaVriddhi farm management app.

Answer in the same language/mix the farmer used (Hindi/English/Hinglish).

CRITICAL RULES:
- Use ONLY the provided farm context for any specific numbers (yield, revenue, moisture, prices, soil data) — never invent figures
- For general farming knowledge questions (pest management, fertilizer types, sowing techniques, crop cycles), answer using your expert agricultural knowledge
- If you don't have enough context-specific information, say so clearly and suggest contacting the local Krishi Vigyan Kendra (KVK)
- Be concise and practical — farmers need actionable advice they can act on today
- Reference the farmer's specific crop, location, and conditions when available in the context
- Keep responses focused (under 250 words) — clear points, no fluff
- Use emojis sparingly to make responses easy to scan on mobile

Your goal: help farmers make better, data-driven decisions using their real farm data plus expert agronomical knowledge.`;

// Lazy-load Gemini client
let genAI = null;

function _getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Ask the AI advisor a question with context.
 * @param {string} farmerId - UUID of the farmer
 * @param {string} queryText - The farmer's question
 * @param {object} context - Farm context (crop data, recommendations, etc.)
 * @param {array} conversationHistory - Previous exchanges (optional)
 * @returns {Promise<string>} - AI response text
 */
async function askAdvisor(farmerId, queryText, context = {}, conversationHistory = []) {
  try {
    const client = _getClient();
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build the full prompt with context
    let prompt = `${SYSTEM_PROMPT}\n\n`;
    
    // Add farm context if available
    if (context.crop) {
      prompt += `FARMER'S CROP DATA:\n`;
      prompt += `- Crop: ${context.crop.crop_type || 'Unknown'}${context.crop.variety ? ' (' + context.crop.variety + ')' : ''}\n`;
      prompt += `- Area: ${context.crop.area_ac || 'Unknown'} acres\n`;
      prompt += `- Sown on: ${context.crop.sow_date || 'Unknown'}\n`;
      prompt += `- Expected harvest: ${context.crop.expected_harvest_date || 'Not set'}\n`;
      prompt += `- Status: ${context.crop.status || 'Unknown'}\n\n`;
    }
    
    if (context.condition) {
      prompt += `CURRENT CROP CONDITION:\n`;
      prompt += `- Overall score: ${context.condition.score || 'N/A'}/100\n`;
      prompt += `- Soil moisture: ${context.condition.soil_moisture_pct || 'N/A'}%\n`;
      prompt += `- Leaf health score: ${context.condition.leaf_color_score || 'N/A'}\n`;
      prompt += `- Pest pressure score: ${context.condition.pest_pressure_score || 'N/A'}\n`;
      prompt += `- Growth stage: ${context.condition.growth_stage_pct || 'N/A'}%\n`;
      prompt += `- Last updated: ${context.condition.computed_at || 'Unknown'}\n\n`;
    }
    
    if (context.recent_recommendations && context.recent_recommendations.length > 0) {
      prompt += `RECENT RECOMMENDATIONS:\n`;
      context.recent_recommendations.slice(0, 3).forEach((rec, idx) => {
        prompt += `${idx + 1}. ${rec.title} (${rec.priority} priority) - ${rec.type}\n`;
        if (rec.predicted_revenue_impact) {
          prompt += `   Impact: ₹${rec.predicted_revenue_impact}`;
          if (rec.revenue_impact_pct) {
            prompt += ` (${rec.revenue_impact_pct > 0 ? '+' : ''}${rec.revenue_impact_pct}%)`;
          }
          prompt += '\n';
        }
        prompt += `   Status: ${rec.status}\n`;
      });
      prompt += '\n';
    }
    
    if (context.latest_grade) {
      prompt += `LATEST CROP GRADING:\n`;
      prompt += `- Grade: ${context.latest_grade.grade}\n`;
      prompt += `- Score: ${context.latest_grade.score || 'N/A'}\n`;
      if (context.latest_grade.estimated_market_price) {
        prompt += `- Estimated market price: ₹${context.latest_grade.estimated_market_price}/${context.latest_grade.unit || 'quintal'}\n`;
      }
      prompt += `- Graded on: ${context.latest_grade.graded_at}\n\n`;
    }
    
    if (context.eligible_schemes && context.eligible_schemes.length > 0) {
      prompt += `ELIGIBLE GOVERNMENT SCHEMES:\n`;
      context.eligible_schemes.slice(0, 3).forEach((scheme, idx) => {
        prompt += `${idx + 1}. ${scheme.name} (${scheme.short_name || ''})\n`;
        prompt += `   Type: ${scheme.scheme_type}\n`;
        prompt += `   Benefit: ${scheme.benefit_description}\n`;
        if (scheme.benefit_amount) {
          prompt += `   Amount: ₹${scheme.benefit_amount}\n`;
        }
        if (scheme.application_window_end) {
          prompt += `   Apply by: ${scheme.application_window_end}\n`;
        }
      });
      prompt += '\n';
    }
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += `PREVIOUS CONVERSATION:\n`;
      conversationHistory.slice(-3).forEach(exchange => {
        prompt += `Farmer: ${exchange.query}\n`;
        prompt += `You: ${exchange.response}\n\n`;
      });
    }
    
    // Add the current question
    prompt += `FARMER'S QUESTION:\n${queryText}\n\n`;
    prompt += `YOUR RESPONSE (in the same language as the question, concise and practical):`;

    console.log(`[geminiClient] Asking Gemini for farmer ${farmerId}: ${queryText.substring(0, 50)}...`);
    
    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log(`[geminiClient] Got response: ${text.substring(0, 100)}...`);
    
    return text.trim();
    
  } catch (err) {
    console.error('[geminiClient] Error calling Gemini API:', err.message);
    
    // Fallback response
    if (err.message.includes('API key')) {
      return 'माफ़ करें, AI सेवा अभी उपलब्ध नहीं है। कृपया अपने स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।\n\nSorry, AI service is not available. Please contact your local Krishi Vigyan Kendra.';
    }
    
    return 'क्षमा करें, मैं अभी आपका सवाल नहीं समझ पाया। कृपया फिर से कोशिश करें या अपने कृषि विज्ञान केंद्र से संपर्क करें।\n\nSorry, I couldn\'t understand your question. Please try again or contact your Krishi Vigyan Kendra.';
  }
}

module.exports = { askAdvisor };
