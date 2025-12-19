
import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, PromptResponse, TargetModel, ModelGender, InteractionMode } from "../types";

export const generateActionSuggestion = async (productName: string, productType: string, features: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `Gere uma ação curta de 8s para demonstrar o produto ${productName}. Use verbos técnicos. Responda apenas com a ação em PT-BR.`,
      config: { temperature: 0.7 }
    });
    return response.text?.trim() || "Entra na cena sorrindo.";
  } catch (e) { 
    return "Entra na cena sorrindo."; 
  }
};

export const generateExtraPrompt = async (productName: string, features: string, userRequest: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: `Gere um bloco de prompt VEO3 único para ${productName} baseado no pedido: ${userRequest}. Use o padrão [TAG]: conteúdo.`,
      config: { temperature: 0.8 }
    });
    return response.text?.trim() || "Erro na geração.";
  } catch (e) { 
    return "Erro de conexão."; 
  }
};

export const generatePrompts = async (data: ProductData): Promise<PromptResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const CHARACTER_DESC = data.gender === ModelGender.MAN 
    ? `AI-generated Brazilian male named Leo, 25yo. Athletic build, sun-kissed skin.`
    : `AI-generated Brazilian female named Ella, 25yo. Wavy brown hair, fit build, sun-kissed skin.`;

  const systemInstruction = `
    VOCÊ É O ENGENHEIRO DE PROMPTS VEO3 DA @ACHADINHOS_DA_ELLEN.
    
    REGRA ABSOLUTA: O campo "full_prompt" deve ser uma string única contendo EXATAMENTE estes 7 blocos, um em cada linha:

    [COMPLIANCE NOTICE]: AI Character Disclosure.
    [CHARACTER]: ${CHARACTER_DESC}
    [PRODUCT_LOCK]: FOTOS REAIS DO NOSSO PRODUTO ${data.productName}. ${data.features}. Preço: R$ ${data.price}. Marca: @achadinhos_da_ellen.
    [SCENE]: 9:16 Vertical, ${data.environment || 'neutral studio'}, ${data.timeOfDay === 'Day' ? 'Day light' : 'Cinematic night light'}.
    [POSTURE]: PHYSICS: ${data.interactionMode === InteractionMode.HANDS_FREE ? 'Hands-free mode. Full range of motion for both hands.' : 'Handheld smartphone POV (selfie style).'}
    [ACTION]: (Descreva a ação técnica em Inglês misturado com PT-BR focando em: ${data.extraContext})
    [DIALOGUE]: [Character] diz: "(Roteiro em PT-BR focado no tom ${data.voiceTone})"

    Gere 4 estratégias de venda (estilo TikTok/Reels) em formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 4 blocos de vídeo para o produto: ${data.productName}. Cada bloco deve ter o seu próprio "full_prompt" com os 7 locks.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  marketing_angle: { type: Type.STRING },
                  tiktok_caption: { type: Type.STRING },
                  segments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        index: { type: Type.NUMBER },
                        full_prompt: { type: Type.STRING }
                      }
                    }
                  }
                },
                required: ["title", "segments"]
              }
            }
          }
        }
      }
    });

    const textResponse = response.text || "";
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Resposta inválida da IA");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("Critical Generation Error:", error);
    throw new Error("FALHA NA SINCRONIZAÇÃO DOS LOCKS. TENTE REDUZIR O TEXTO DAS ESPECIFICAÇÕES.");
  }
};
