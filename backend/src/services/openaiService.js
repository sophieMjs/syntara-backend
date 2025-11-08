// src/services/openaiService.js
// Servicio profesional para comunicar el backend con la API de OpenAI
// Maneja:
//   • Construcción de prompts
//   • Reintentos inteligentes
//   • Validación estricta de JSON
//   • Limpiado automático de respuestas
//   • Logging útil para debugging
//   • Uso centralizado para todo el proyecto

const OpenAI = require("openai");

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY no está configurada en el .env");
        }

        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        this.model = process.env.OPENAI_MODEL || "gpt-5-mini";
        this.temperature = 0.0;
        this.maxTokens = 2500;
        this.maxRetries = 3;
        this.retryDelay = 1200; // ms
    }

    /**
     * Hace una petición a la API de OpenAI con reintentos inteligentes
     */
    async sendPrompt(prompt, options = {}) {
        if (!prompt || typeof prompt !== "string") {
            throw new Error("El prompt debe ser una cadena válida.");
        }

        const model = options.model || this.model;
        const temperature = options.temperature ?? this.temperature;
        const max_tokens = options.max_tokens || this.maxTokens;

        let attempt = 0;

        while (attempt < this.maxRetries) {
            try {
                const start = Date.now();

                const response = await this.client.chat.completions.create({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    temperature,
                    max_tokens
                });

                const content = response?.choices?.[0]?.message?.content?.trim();

                if (!content) {
                    throw new Error("OpenAI respondió vacío o en formato no válido");
                }

                const duration = ((Date.now() - start) / 1000).toFixed(2);
                console.log(`✅ [OpenAI] Respuesta recibida (${duration}s) — Modelo: ${model}`);

                return content;

            } catch (error) {
                attempt++;
                const isLast = attempt === this.maxRetries;

                console.error(`❌ [OpenAI] Error intento ${attempt}/${this.maxRetries}:`, error.message);

                const rateLimit = error?.error?.type === "rate_limit_exceeded";
                const timeout = error.message.includes("timeout");

                if (isLast) {
                    if (rateLimit) throw new Error("Límite de uso de OpenAI alcanzado.");
                    if (timeout) throw new Error("Timeout al conectar con OpenAI.");
                    throw new Error("No se pudo obtener respuesta de OpenAI.");
                }

                const delay = this.retryDelay * attempt;
                console.log(`⏳ Reintentando en ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }

    /**
     * Intenta parsear la respuesta como JSON, corrigiendo errores comunes
     */
    parseJSON(text) {
        if (!text) throw new Error("Respuesta vacía");

        // 1. Remover texto antes y después del JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No se encontró JSON en la respuesta de OpenAI.");

        let cleaned = jsonMatch[0];

        // 2. Reemplazar comas finales
        cleaned = cleaned.replace(/,\s*}/g, "}");
        cleaned = cleaned.replace(/,\s*]/g, "]");

        // 3. Intentar parseo
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            console.error("❌ JSON parse error:", e);
            throw new Error("OpenAI devolvió un JSON malformado.");
        }
    }

    /**
     * Prompt builder para búsqueda de precios en tiendas colombianas
     */
    buildPricePrompt({ product, quantity = 1, unit = null, stores = [] }) {
        const storeList =
            stores.length > 0
                ? stores.join(", ")
                : "D1, Ara, Olímpica, Éxito, Alkosto, Ktronix, Panamericana";

        return `
Eres un sistema encargado de consultar precios de productos en tiendas de Colombia.
Debes devolver únicamente un JSON con el formato EXACTO descrito abajo.

PRODUCTO: "${product}"
CANTIDAD: ${quantity}
UNIDAD: ${unit || "unidad"}
TIENDAS A CONSULTAR: ${storeList}

Devuelve EXCLUSIVAMENTE un JSON con este formato:

{
  "results": [
    {
      "product": "string",
      "store": "string",
      "price": number,
      "unitPrice": number|null,
      "currency": "COP",
      "url": "string|null",
      "date": "YYYY-MM-DD",
      "confidence": number (0-1)
    }
  ]
}

REGLAS:
- No incluyas nada fuera del JSON.
- No expliques nada.
- No incluyas notas.
- No uses markdown.
- Solo retornar JSON válido.
`;
    }
}

module.exports = new OpenAIService();
