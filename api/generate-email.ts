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
// Construct a rich prompt describing the project parameters and expectations
    const prompt = `
You are an expert Enterprise Project Manager. Your task is to generate a highly professional, tailored Project Kick-off Email for a client to kick off a new software/services project.

Here are the details for the project:
- **Project Name**: ${projectName}
- **Client Name**: ${clientName}
- **Project Manager**: ${pmName || "TBD"}
- **Design Package Selected**: ${designPackage} (This indicates the tier/level of UX, look & feel, custom styling, and layout fidelity being purchased: Standard, Premium, or Ultimate/Enterprise. Make sure to reference or align the kick-off steps to this tier in the email if appropriate)
- **Standard Implementation Timelines Guideline**:
## Standard Implementation Timelines
Use the following durations to set expectations in the "Next Steps" section of the email based on the selected package (treat Ultimate as the Enterprise equivalent if Selected):

*   **Standard Package:** 8-10 weeks. Focuses on core configuration and basic training.
*   **Premium Package:** 12-16 weeks. Includes deep integrations, custom data mapping, and extended staff training.
*   **Enterprise/Ultimate Package:** 20–24 weeks. Includes full ERP integration, custom workflow development, and phased go-live support.

- **Target Kick-off Meeting Date**: ${targetKickoffDate || "TBD"}
- **Selected Products/Modules to Implement**: ${selectedProducts.join(", ")}
- **3rd Party Integration Categories Selected**: ${selectedIntegrationCategories.length > 0 ? selectedIntegrationCategories.join(", ") : "None explicitly selected"}
${
  selectedIntegrationCategories.length > 0
    ? `- **Category-Specific Integration Details**:\n  ${selectedIntegrationCategories.map((cat: string) => `- ${cat}: ${integrationDetails[cat] || "No specific details provided"}`).join("\n  ")}`
    : ""
}
- **Legacy Systems / Custom Integration Notes**: ${apiIntegrations || "None specified"}
- **Client Communication Preferences**:
  - Frequency: ${communicationPreferences.frequency || "Weekly"}
  - Preferred Channels: ${communicationPreferences.channels?.join(", ") || "Email"}
  - Tone & Style: ${communicationPreferences.tone || "Professional and collaborative"}
  - Preferred Meeting Times: ${communicationPreferences.timeOfDay || "Business hours"}
- **Stakeholders Involved**:
  ${
    stakeholders.length > 0
      ? stakeholders
          .map(
            (s: any, idx: number) =>
              `${idx + 1}. ${s.name || "Unnamed"} - Role: ${s.role || "TBD"} (${s.email || "No Email"}), Department: ${s.department || "N/A"}`
          )
          .join("\n  ")
      : "None listed"
  }
- **Selected Upsell Opportunities to Present (No-pressure collaborative context)**: ${selectedUpsells.length > 0 ? selectedUpsells.join(", ") : "None selected"}
- **Special PM Requests / Requirements**: ${specialRequests || "None specified"}
- **Additional Context/Notes**: ${additionalNotes || "None"}

Generate a comprehensive project kick-off email that:
1. Warmly introduces the project manager (${pmName || "the team"}) and acknowledges the client (${clientName}).
2. Use exactly these bold headers as section dividers, and write the email body sequentially using them:
   - **Project Scope and Objectives** (under this header, lead with building a new municipal website and migrating 150 webpages, followed by the selected implementation products)
   - **Technical Integrations** (under this header, list the selected 3rd party API integrations)
   - **Project Timeline** (under this header, state the expected timeline based on the selected design package)
   - **Communication and Kick-off** (under this header, list stakeholder roles, communication preferences, and kick-off details)
3. Under **Project Scope and Objectives**, lead the section with an introductory paragraph stating that we are building a new municipal website complete with the migration of 150 webpages, along with the custom products and 3rd party API integrations they selected. Then, reference the selected products/modules and state how they will transform or address their needs. **IMPORTANT**: You MUST present these selected products (${selectedProducts.join(", ")}) in a clean, bulleted list format (e.g., using '-' or '*' markdown bullets), with each bullet briefly explaining how that module transforms/addresses their needs (e.g., if "Web Accessibility" is selected, mention compliance and inclusion; if "Utility Billing", talk about payment processing efficiency). Do not put them in a single paragraph.
4. Under **Technical Integrations**, incorporate the required 3rd party API integrations. **IMPORTANT**: You MUST present these integrations as a clear, easy-to-read bulleted list (using '-' or '*' markdown bullets) where each bullet represents a selected integration/category with its details and next steps to secure technical access/credentials:
${
  selectedIntegrationCategories.length > 0 
    ? selectedIntegrationCategories.map((cat: string) => `   - **${cat}**: ${integrationDetails[cat] || "Standard configuration setup."}`).join("\n")
    : "   - No 3rd party integrations explicitly selected."
}
${apiIntegrations ? `   - **Custom / Legacy Systems**: ${apiIntegrations}` : ""}
5. Under **Project Timeline**, using the provided Design Package (${designPackage}), state the expected timeline based on the following 'Standard Implementation Timelines' reference:
   - If Standard: "Based on your selected Standard Package, we anticipate an 8–10 week implementation timeline. Focuses on core configuration and basic training."
   - If Premium: "Based on your selected Premium Package, we anticipate a 12–16 week implementation timeline. Includes deep integrations, custom data mapping, and extended staff training."
   - If Ultimate: "Based on your selected Ultimate Package, we anticipate a 20–24 week implementation timeline. Includes full ERP integration, custom workflow development, and phased go-live support."
6. Under **Communication and Kick-off**, welcome the identified stakeholders by name/role, outline clear expectations for client communication based on preferences (channels: ${communicationPreferences.channels?.join(", ") || "Email"}, frequency: ${communicationPreferences.frequency || "Weekly"}), and propose the target kick-off meeting date (${targetKickoffDate || "TBD"}) setting a brief agenda.
   - **IMPORTANT**: If any Upsell Opportunities were selected (${selectedUpsells.join(", ")}), present them in a highly supportive, completely optional, no-pressure manner at the end of this section as a way to open the door for a friendly conversation with the client down the road (e.g. mention them as optional value-add areas we can support them with, keeping it light and collaborative).
7. Keeps a ${communicationPreferences.tone || "professional and collaborative"} tone.
8. **Strict Formatting Rules**:
   - Add a clear double line break (an empty line) between all paragraphs, headers, and list sections for clean, readable layout.
   - Use bulleted lists for the Implementation Products and the 3rd Party API Integrations.
   - Do NOT use unnecessary or excessive bolding inside paragraphs. Only use bold text for the section titles specified above or bullet labels. Avoid arbitrary bolding of random verbs or adjectives in the email text to keep it polished and readable.
   - **IMPORTANT**: The email must end exactly with "Warm Regards" and have absolutely no name, title, or text written after it.
   - Avoid placeholder brackets [like this] in the final output; instead, use the provided details or write natural placeholder text if detail is missing.

Your response must strictly match the following JSON schema:
- \`subject\`: Engaging, clear, and professional subject line.
- \`body\`: The full text of the email formatted with clean Markdown.
- \`keyMeetingAgenda\`: Array of 3-5 high-level agenda topics for the kick-off session.
- \`clientToDos\`: Array of 2-4 immediate actions or documents/access the client must prepare.
- \`pmNotes\`: Tactical tips or strategic reminders specifically for the Project Manager sending this email.
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
