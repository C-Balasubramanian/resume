import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceText(text: string, context: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert resume writer. Enhance the following text to make it more professional, impactful, and action-oriented. Keep it concise.
    
Context about this section: ${context}
Original text: ${text}

Return ONLY the enhanced text, without any markdown formatting or explanations.`,
  });
  return response.text || text;
}

export async function generateResumeFromNotes(notes: string): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the following raw notes into a structured resume format. If information is missing, leave the fields empty.
    
Raw notes:
${notes}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personal: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING, description: "Professional title, e.g. Full Stack Developer" },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              website: { type: Type.STRING },
            }
          },
          aboutMe: { type: Type.STRING, description: "A brief about me paragraph." },
          summary: { type: Type.STRING, description: "A professional summary. Generate one if not explicitly provided but enough context exists." },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Generate a random unique ID" },
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.STRING, description: "Bullet points describing the role. Make it professional." },
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Generate a random unique ID" },
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                year: { type: Type.STRING },
                percentage: { type: Type.STRING, description: "Percentage or CGPA, e.g., 83%" },
                university: { type: Type.STRING, description: "University name, if distinct from school/college" },
              }
            }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "Category of skills, e.g., Frontend, Backend, Tools" },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          declaration: { type: Type.STRING, description: "A formal declaration statement at the end of the resume, if present." },
          signature: { type: Type.STRING, description: "The name used for the signature at the bottom of the resume, usually the person's name." }
        },
        required: ["personal", "summary", "experience", "education", "skills"]
      }
    }
  });

  try {
    let cleanText = response.text || "{}";
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\n/, "").replace(/\n```$/, "");
    }
    return JSON.parse(cleanText) as ResumeData;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate resume from notes.");
  }
}
