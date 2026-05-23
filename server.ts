/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

const PORT = 3000;

/**
 * Lazy initializer for Google GenAI client to prevent startup crashes when GEMINI_API_KEY is unset.
 */
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Launches the unified full-stack server hosting both api routes and dev assets.
 */
async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: AI Tactical Crowd Management advisory proxying Google Gemini API
  app.post('/api/mitigate', async (req, res) => {
    try {
      const { situation } = req.body;
      if (!situation) {
        return res.status(400).json({ error: 'Situation description parameter is required.' });
      }

      // Check if API key is present; fallback gracefully with realistic mockup if missing
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        console.warn('GEMINI_API_KEY is not configured. Falling back to simulated local mitigation advisor.');
        
        // Return highly realistic mock recommendation
        const mockPromptLower = situation.toLowerCase();
        let location = 'North Gates & Entrance Plaza';
        let plan = '1. Force-open Gate F bypass gates to offload 35% of queue traffic.\n2. Dispatch 10 Volunteers with emergency megaphones to direct family ticket holders to secondary lanes.\n3. Turnstile readers reset in progress.';
        let announcement = 'Attention fans in North Plaza: Gate A is currently congested. Direct route bypass is active towards Gate F. Staff are waiting to assist you.';
        let score = 75;

        if (mockPromptLower.includes('dehydration') || mockPromptLower.includes('medical')) {
          location = 'Stand North (Level 1) Sector B';
          plan = '1. Deploy Triage Medic Unit D immediately to Stand North L1 with cold hydration packs.\n2. Direct concourse volunteers to hand out water vouchers.\n3. Instruct stewards to open ventilation screens.';
          announcement = 'Attention guests in Stand North: First Aid responders are assisting spectators. Free hydration stations are active at concourse kiosks.';
          score = 82;
        } else if (mockPromptLower.includes('weather') || mockPromptLower.includes('downpour')) {
          location = 'All Stands & Perimeter Exits';
          plan = '1. Broaden dispersal exit routes towards Southern Metropolitan Metro decks.\n2. Open ground level exits directly bounding the grassy perimeters.\n3. Turn on main floodlights for walkway safety.';
          announcement = 'Attention fans: Rain is imminent. To avoid crowd friction, please utilize auxiliary Southern concourses for rapid metro access.';
          score = 90;
        }

        return res.json({
          id: `ai-${Date.now()}`,
          bottleneckLocation: location,
          tacticalPlan: plan,
          suggestedAction: announcement,
          urgencyScore: score,
          timestamp: new Date().toISOString()
        });
      }

      // Standard active SDK query utilizing recommended gemini-3.5-flash structure
      const ai = getGeminiClient();
      const prompt = `
        Analyze this stadium safety or crowd bottleneck scenario and generate precise, tactical crowd redirection advice.
        
        SCENARIO SITUATION:
        "${situation}"

        You must suggest a strategic response. Be concise, realistic, and highly professional.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a veteran World-Class Stadium Emergency Coordinator and Crowd Routing Specialist. You always return JSON structured recommendations with extreme precision.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bottleneckLocation: {
                type: Type.STRING,
                description: 'The primary stadium coordinates, gates, or stands in distress.',
              },
              tacticalPlan: {
                type: Type.STRING,
                description: 'A numbered list of immediate strategic containment directives for stewards and security staff.',
              },
              suggestedAction: {
                type: Type.STRING,
                description: 'The exact wording of a public PA speaker announcement or phone broadcast push notification.',
              },
              urgencyScore: {
                type: Type.INTEGER,
                description: 'Triage index value from 0 (normal standby) to 100 (critical panic alert).',
              },
            },
            required: ['bottleneckLocation', 'tacticalPlan', 'suggestedAction', 'urgencyScore'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({
        id: `ai-${Date.now()}`,
        bottleneckLocation: parsedData.bottleneckLocation || 'Detected Bottleneck Sector',
        tacticalPlan: parsedData.tacticalPlan || 'Deploy usters and volunteers immediately to alleviate flow.',
        suggestedAction: parsedData.suggestedAction || 'Please follow stewards directions towards nearest exit gates.',
        urgencyScore: parsedData.urgencyScore || 50,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error('Gemini API Error details:', err);
      return res.status(500).json({ error: err.message || 'Error occurred calling Gemini server.' });
    }
  });

  // Load Vite DevServer middleware in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving behavior
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unified Stadium Server running on http://0.0.0.0:${PORT}`);
  });
}

// Boot the stack
startServer();
