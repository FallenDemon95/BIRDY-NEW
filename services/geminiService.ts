
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

export class GeminiService {
  private static getAi() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async suggestCategory(merchant: string, items: string): Promise<string> {
    const ai = this.getAi();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the merchant "${merchant}" and items "${items}", suggest the most appropriate category from this list: Groceries, Electronics, Clothing, Dining, Other. Return only the category name.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      const text = response.text?.trim() || 'Other';
      return text;
    } catch (error) {
      console.error("Categorization Error:", error);
      return 'Other';
    }
  }

  static async analyzeReceiptImage(base64Image: string): Promise<any> {
    const ai = this.getAi();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: "Extract receipt details: merchant name, total amount, date, and list of items with prices. Format as JSON with keys: merchant, amount, date, items (array of {name, price}), and suggestedCategory.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("OCR Analysis Error:", error);
      return null;
    }
  }

  static async analyzeEmailText(emailBody: string): Promise<any> {
    const ai = this.getAi();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this order confirmation email and extract: Merchant, Amount, Date, Items. Text: ${emailBody}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchant: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              date: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    price: { type: Type.NUMBER }
                  }
                }
              },
              category: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Email Sync Error:", error);
      return null;
    }
  }
}
