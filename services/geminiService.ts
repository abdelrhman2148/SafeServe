
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, ChecklistTask } from "../types";

export const getGeminiInsights = async (logs: LogEntry[], tasks: ChecklistTask[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const simplifiedLogs = logs.map(l => {
    const task = tasks.find(t => t.id === l.taskId);
    return {
      task: task?.title,
      category: task?.category,
      value: l.value,
      timestamp: l.timestamp,
      target: task?.type === 'TEMPERATURE' ? `${task.minTemp}-${task.maxTemp}` : 'Check'
    };
  });

  const prompt = `
    As a professional health inspector consultant, analyze the following restaurant food safety logs for today. 
    Identify any critical violations, trends, or areas of concern. 
    Suggest 3 actionable steps to improve compliance.
    
    Data:
    ${JSON.stringify(simplifiedLogs)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            violations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            complianceScore: { type: Type.NUMBER, description: "Score from 0 to 100" }
          },
          required: ["summary", "violations", "recommendations", "complianceScore"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
