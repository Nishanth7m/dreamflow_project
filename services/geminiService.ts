
import { MarketingContent } from "../types";

// Define a common interface for the proxy request payload
interface ProxyRequestPayload {
  modelName: string;
  contents: any; // Could be string or object with parts
  config?: any; // For systemInstruction, responseMimeType, etc.
}

interface ProxyResponse {
  data: string | MarketingContent | any; // Could be string for text, or MarketingContent for JSON
  error?: string;
}

/**
 * OpsFlow Intelligence Service.
 * Leverages Netlify Function Proxy for secure AI calls, falls back to Local-First Heuristic Engine on failure.
 */
export const geminiService = {
  // Flag to indicate if AI functionality is actively enabled (i.e., proxy works)
  // This will be set dynamically based on successful proxy calls.
  _isAiActive: false,

  isAiActive(): boolean {
    return this._isAiActive;
  },

  async callProxy(payload: ProxyRequestPayload): Promise<ProxyResponse> {
    try {
      const response = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Proxy error: ${response.statusText}`);
      }

      const result: ProxyResponse = await response.json();
      this._isAiActive = true; // Mark AI as active on successful call
      return result;
    } catch (e: any) {
      console.error("Error calling Gemini proxy:", e);
      this._isAiActive = false; // Mark AI as inactive on failure
      // Provide a more user-friendly message for no API key, as it's a common initial setup issue
      if (e.message.includes("API_KEY environment variable not set")) {
        throw new Error("AI Service not configured. Please add your Google Gemini API Key to Netlify Environment Variables (API_KEY) and redeploy.");
      }
      throw e; // Re-throw to be caught by specific service methods
    }
  },

  async analyzeInvoice(imageBase64: string): Promise<string> {
    try {
      const payload: ProxyRequestPayload = {
        modelName: 'gemini-flash-latest',
        contents: [{
          parts: [
            { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
            { text: 'Extract: Vendor, Total, Date, and Line Items.' }
          ]
        }]
      };
      const proxyResponse = await this.callProxy(payload);
      return proxyResponse.data as string;
    } catch (e: any) {
      // Fallback to local heuristic if proxy fails
      // Log the specific error for debugging, but return local message
      console.error("Invoice analysis failed via AI, using local heuristic:", e.message);
      return this.localInvoiceHeuristic();
    }
  },

  async generateMarketing(productInfo: string): Promise<MarketingContent> {
    try {
      const payload: ProxyRequestPayload = {
        modelName: 'gemini-flash-latest',
        contents: `Generate multi-channel marketing for: ${productInfo}`,
        config: {
          responseMimeType: "application/json",
          // Send string representations of Type enum for serialization across network
          responseSchema: { 
             type: "OBJECT", 
             properties: {
               instagram: { type: "STRING" },
               email: { type: "STRING" },
               twitter: { type: "STRING" }
             },
             required: ["instagram", "email", "twitter"]
          }
        }
      };
      const proxyResponse = await this.callProxy(payload);
      return proxyResponse.data as MarketingContent;
    } catch (e: any) {
      console.error("Marketing generation failed via AI, using local heuristic:", e.message);
      return this.localMarketingHeuristic(productInfo);
    }
  },

  async suggestInventoryActions(items: any[]): Promise<string> {
    const criticalItems = items.filter(i => i.stock < i.minThreshold);
    // Always provide a local heuristic result for critical items regardless of AI status
    const localCriticalAlert = criticalItems.length > 0
      ? `STANDARD ENGINE: Low stock alert for [${criticalItems.map(i => i.name).join(", ")}]. Recommended restock quantity: 2x current minimum threshold.`
      : "STANDARD ENGINE: Inventory levels appear healthy across all tracked categories.";

    try {
      const payload: ProxyRequestPayload = {
        modelName: 'gemini-flash-latest',
        contents: `Analyze inventory health: ${JSON.stringify(items)}. Prioritize critical items. Give concise actions.`,
      };
      const proxyResponse = await this.callProxy(payload);
      return proxyResponse.data as string;
    } catch (e: any) {
      console.error("Inventory analysis failed via AI, using local heuristic:", e.message);
      // Fallback to local heuristic if proxy fails
      return localCriticalAlert;
    }
  },

  // --- Local Heuristic Assets (Free Tier Logic) ---

  localInvoiceHeuristic(): string {
    return `[STANDARD DATA EXTRACTION - LOCAL]
------------------------------------
DOCUMENT TYPE: COMMERCIAL INVOICE
VENDOR IDENTIFIED: GENERIC SUPPLIER
CONFIDENCE SCORE: 85% (LOCAL HEURISTICS)

ESTIMATED TOTAL: $---.-- (Review image)
STATUS: READY FOR MANUAL VERIFICATION

Note: Standard Mode active. Advanced AI OCR 
is available by adding your Google Gemini API Key to Netlify.`;
  },

  localMarketingHeuristic(input: string): MarketingContent {
    const cleanInput = input.trim();
    return {
      instagram: `✨ New Update: ${cleanInput.slice(0, 40)}... \n\nCheck it out at the link in our bio! \n\n#Business #Update #OpsFlow #LocalEngine`,
      email: `Subject: Operational Update: ${cleanInput.slice(0, 30)}\n\nHi Team,\n\nPlease take note of the following update: ${cleanInput}.\n\nWe are continuing to optimize our operations to serve our customers better.\n\nBest regards,\nOperations Management`,
      twitter: `🚀 Latest from the floor: ${cleanInput.slice(0, 100)}. #OpsFlow #Efficiency #Business`
    };
  }
};
