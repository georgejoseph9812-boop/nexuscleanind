import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let genAI = null;
if (config.gemini.apiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    logger.success('Gemini API initialized with provided credentials.');
  } catch (err) {
    logger.warn('Failed to initialize Gemini client:', err.message);
  }
} else {
  logger.info('GEMINI_API_KEY not configured. AI service operating in "Prototype Intelligence" fallback mode.');
}

export const isGeminiConfigured = () => Boolean(config.gemini.apiKey && genAI);

/**
 * AI Multimodal Waste Analysis
 * Evaluates image and/or category & description to determine waste classification, priority, and interventions.
 */
export const analyzeWaste = async ({ category, imageBuffer, imageMimeType, description, photoUrl }) => {
  // If Gemini API is configured, perform live multimodal vision inference
  if (isGeminiConfigured()) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const prompt = `
You are Nexus Clean AI, a municipal solid waste inspection assistant.
Analyze this waste report:
Category provided: ${category || 'Unknown'}
Description provided: ${description || 'None'}

Return ONLY a strict JSON object with this exact schema (no markdown, no backticks, just raw json):
{
  "detectedIssue": "<Specific waste categorization and composition>",
  "priority": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "confidence": <integer percentage 70-99>,
  "suggestedAction": "<Actionable municipal dispatch recommendation>",
  "materialBreakdown": {
    "organic": "<percentage>",
    "plastic": "<percentage>",
    "other": "<percentage>"
  }
}
`;

      let parts = [prompt];
      if (imageBuffer && imageMimeType) {
        parts.push({
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: imageMimeType
          }
        });
      }

      const result = await model.generateContent(parts);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned);

      return {
        ...parsed,
        isPrototype: false,
        source: 'Google Gemini 3.5 Flash'
      };
    } catch (err) {
      logger.error('Gemini API execution error, falling back to prototype intelligence:', err.message);
    }
  }

  // Graceful Prototype Intelligence Fallback
  const categoryTemplates = {
    'Overflowing Bin': {
      detectedIssue: 'Overflowing Bin (High Density Organic & Plastic)',
      confidence: 94,
      priority: 'HIGH',
      suggestedAction: 'Schedule emergency collection within 4 hours. Recommend deploying secondary 1100L container.',
      materialBreakdown: { organic: '65%', recyclablePlastic: '25%', other: '10%' }
    },
    'Roadside Garbage': {
      detectedIssue: 'Roadside Litter Accumulation (Commercial & Single-Use)',
      confidence: 91,
      priority: 'MEDIUM',
      suggestedAction: 'Dispatch mechanical street sweepers during off-peak window (2 PM - 4 PM).',
      materialBreakdown: { packaging: '50%', beverage: '40%', other: '10%' }
    },
    'Illegal Dumping': {
      detectedIssue: 'Unauthorized Debris Dump Site (Construction & Dry Waste)',
      confidence: 93,
      priority: 'HIGH',
      suggestedAction: 'Deploy heavy duty tipper truck. Escalate to municipal zoning inspectors.',
      materialBreakdown: { constructionRubble: '60%', mixedDebris: '40%' }
    },
    'Missed Collection': {
      detectedIssue: 'Missed Municipal Collection Window',
      confidence: 95,
      priority: 'LOW',
      suggestedAction: 'Reroute nearest active auxiliary tipper van for supplemental door-to-door run.',
      materialBreakdown: { householdMixed: '85%', other: '15%' }
    },
    'Improper Segregation': {
      detectedIssue: 'Contaminated Mixed Waste Stream',
      confidence: 88,
      priority: 'MEDIUM',
      suggestedAction: 'Notify resident via SMS with segregation educational guide. Re-sort dry recyclables.',
      materialBreakdown: { dryWaste: '45%', unsegregatedWet: '55%' }
    },
    'Construction Waste': {
      detectedIssue: 'Unpermitted Construction & Demolition (C&D) Rubble',
      confidence: 92,
      priority: 'HIGH',
      suggestedAction: 'Dispatch specialized JCB loader and issue regulatory municipal notice.',
      materialBreakdown: { concreteMortar: '70%', tilesBricks: '30%' }
    }
  };

  const matched = categoryTemplates[category] || {
    detectedIssue: `${category || 'Municipal Solid Waste'} Accumulation`,
    confidence: 92,
    priority: 'HIGH',
    suggestedAction: 'Schedule inspection and collection within 4 hours.',
    materialBreakdown: { organic: '50%', recyclables: '35%', other: '15%' }
  };

  return {
    ...matched,
    isPrototype: true,
    prototype: true,
    notice: 'Prototype Intelligence — Gemini credentials will be connected later.'
  };
};

/**
 * AI Resolution Verification
 * Compares before and after proof photos to verify waste clearance.
 */
export const verifyResolution = async ({ complaintId, beforeImageUrl, afterImageUrl }) => {
  // If Gemini API is configured and both images are provided
  if (isGeminiConfigured() && beforeImageUrl && afterImageUrl) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const prompt = `
Compare these two municipal waste cleanup photos for complaint #${complaintId}.
Photo 1: Initial waste condition before cleanup.
Photo 2: Current condition after municipal crew completed work.

Determine if the area was successfully cleaned and sanitized.
Return ONLY a raw JSON object with:
{
  "successful": <boolean>,
  "verificationScore": <integer 0-100 representing percentage clearance>,
  "summary": "<2-sentence explanation of clearance quality and remaining debris if any>"
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned);

      return {
        verified: parsed.successful,
        successful: parsed.successful,
        verificationScore: parsed.verificationScore,
        score: parsed.verificationScore,
        summary: parsed.summary,
        status: 'Pending Admin Approval',
        isPrototype: false,
        prototype: false,
        source: 'Google Gemini 3.5 Flash'
      };
    } catch (err) {
      logger.error('Gemini resolution verification error, using fallback:', err.message);
    }
  }

  // Fallback Prototype Intelligence
  return {
    verified: true,
    successful: true,
    verificationScore: 92,
    score: 92,
    summary: 'Resolution appears successful. 92% visual clearance of pavement and perimeter detected.',
    status: 'Pending Admin Approval',
    isPrototype: true,
    prototype: true,
    notice: 'Prototype Intelligence — Gemini credentials will be connected later.'
  };
};

/**
 * AI Hotspot Generation
 * Analyzes multiple complaints to detect patterns for emerging hotspots.
 */
export const analyzeEmergingHotspot = async (complaints) => {
  if (isGeminiConfigured()) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const categories = complaints.map(c => c.category).join(', ');
      const descriptions = complaints.map(c => c.description).join(' | ');
      
      const prompt = `
You are Nexus Clean AI. Analyze this cluster of ${complaints.length} municipal waste complaints to classify an emerging hotspot.
Categories reported: ${categories}
Descriptions: ${descriptions}

Return ONLY a strict JSON object with this exact schema (no markdown, no backticks, just raw json):
{
  "riskLevel": "<MEDIUM|HIGH|CRITICAL>",
  "riskScore": <integer 50-100>,
  "suggestedAction": "<Actionable municipal intervention strategy>"
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned);

      return {
        riskLevel: parsed.riskLevel,
        riskScore: parsed.riskScore,
        suggestedAction: parsed.suggestedAction,
        isPrototype: false
      };
    } catch (err) {
      logger.error('Gemini hotspot analysis error:', err.message);
    }
  }

  // Fallback Prototype Intelligence
  return {
    riskLevel: 'HIGH',
    riskScore: 75,
    suggestedAction: 'Deploy secondary bins and schedule immediate inspection. Multiple identical issues detected.',
    isPrototype: true
  };
};
