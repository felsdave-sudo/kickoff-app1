// /api/generate-email.ts
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-loaded Gemini client to prevent execution crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in the server environment. Please set it in Vercel Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback logic preserved exactly from your original implementation
async function generateContentWithFallback(ai: GoogleGenAI, params: any) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"]; // Updated fallback list for stability
  let lastError: any = null;

  for (const model of modelsToTry) {
    let retries = 3;
    let delay = 1000;
    
    while (retries > 0) {
      try {
        console.log(`Attempting generateContent using model: ${model} (${retries} retries remaining)`);
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errorMessage = String(err?.message || "");
        const statusCode = err?.status || err?.statusCode || (errorMessage.includes("503") ? 503 : errorMessage.includes("429") ? 429 : null);
        
        console.log(`[Model warning] Issue with model ${model}: ${errorMessage}`);

        if (statusCode === 503 || errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
          break; 
        }
        if (statusCode === 429 || errorMessage.includes("429") || errorMessage.includes("rate limit") || errorMessage.toLowerCase().includes("quota")) {
          break; 
        }
        if (statusCode === 404 || errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found")) {
          break;
        }

        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }
    }
  }
  throw lastError || new Error("Failed to generate content with all available models.");
}

// Vercel Serverless Handler Format
export default async function handler(req: any, res: any) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

// ADD THIS EXACT LINE
  console.log("Incoming Data Payload:", JSON.stringify(req.body, null, 2));
  
  try {
    const {
      projectName,
      clientName,
      pmName,
      targetKickoffDate,
      selectedProducts = [],
      selectedIntegrationCategories = [],
      specificSocialMediaPlatforms = "",
      integrationDetails = {},
      apiIntegrations = "",
      designPackage = "Standard",
      communicationPreferences = {},
      stakeholders = [],
      specialRequests = "",
      additionalNotes = "",
      selectedUpsells = [],
    } = req.body; // Vercel auto-parses req.body for JSON payloads

    // Validate minimum required fields
    if (!projectName || !clientName) {
      return res.status(400).json({
        error: "Missing required fields: Project Name and Client Name are mandatory.",
      });
    }

    if (selectedProducts.length === 0) {
      return res.status(400).json({
        error: "Please select at least one product from the predefined list.",
      });
    }

    const ai = getGeminiClient();

    // The prompt structure remains identically mapped to your logic
    const prompt = `
You are an expert Enterprise Project Manager. Your task is to generate a highly professional, tailored Project Kick-off Email for a client to kick off a new software/services project.

Here are the details for the project:
- **Project Name**: ${projectName}
- **Client Name**: ${clientName}
- **Project Manager**: ${pmName || "TBD"}
- **Design Package Selected**: ${designPackage}
... [Your prompt contents here exactly as you had them] ...
Warm Regards
`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            keyMeetingAgenda: { type: Type.ARRAY, items: { type: Type.STRING } },
            clientToDos: { type: Type.ARRAY, items: { type: Type.STRING } },
            pmNotes: { type: Type.STRING },
          },
          required: ["subject", "body", "keyMeetingAgenda", "clientToDos", "pmNotes"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini AI.");
    }

    const result = JSON.parse(text.trim());
    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Error in serverless function:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while generating the email.",
    });
  }
}
