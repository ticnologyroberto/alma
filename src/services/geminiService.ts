import { GoogleGenAI } from "@google/genai";
import { PlayerData } from "../types";
import { mockPlayers } from "../mockData";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAgentResponse(userMessage: string) {
  try {
    const systemInstruction = `
      Eres el "Secretario Técnico 24/7" de un club de fútbol de élite (X Administrator). 
      Tu tono es profesional, ejecutivo, directo y "futbolero". 
      Tienes acceso a los datos de los jugadores del club. 
      Tu objetivo es ayudar al Presidente a tomar decisiones estratégicas basadas en datos.
      
      Reglas:
      1. Si el usuario pregunta por un jugador específico, usa sus datos financieros y de rendimiento.
      2. Calcula el riesgo de toxicidad (τ > 2.0 es crítico).
      3. Siempre cita la fuente (ej: "Basado en el reporte financiero de marzo").
      4. Sé proactivo. Si detectas un problema, sugiere una acción (Vender, Renovar, etc.).
      5. No alucines. Si no tienes datos, di "No tengo esa información en los módulos actuales".
      
      Datos actuales del plantel:
      ${JSON.stringify(mockPlayers, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, Presidente. Hubo un error al procesar su consulta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Presidente, la conexión con el cerebro central Vertex AI ha fallado. Por favor, intente de nuevo.";
  }
}
