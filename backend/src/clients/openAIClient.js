const OpenAI = require("openai");
require("dotenv").config();
const SearchPromptBuilder = require("../services/propmtBuilders/searchPromptBuilder");

class OpenAIClient {
    constructor() {
        if (OpenAIClient.instance) return OpenAIClient.instance;

        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Falta la variable de entorno OPENAI_API_KEY");
        }

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.model = process.env.OPENAI_MODEL || "gpt-5.1";

        const configuredLimit = this._sanitizeTokenLimit(process.env.OPENAI_MAX_COMPLETION_TOKENS ?? process.env.OPENAI_MAX_TOKENS);
        this.maxTokens = configuredLimit;

        OpenAIClient.instance = this;
    }

    async sendPrompt({ product, quantity, unit, city = "Bogotá" }) {
        // Instanciar el prompt builder
        const promptBuilder = new SearchPromptBuilder();
        const prompt = promptBuilder.buildPrompt({ product, quantity, unit, city });

        // El arreglo de páginas permitidas para la búsqueda web
        const allowedDomains = [
            "exito.com", "carulla.com", "mercadolibre.com.co", "rappi.com.co",
            "colombia.oxxodomicilios.com", "d1.com.co", "aratiendas.com", "olimpica.com",
            "jumbocolombia.com", "tiendasmetro.co", "tienda.makro.com.co", "alkosto.com",
            "alkomprar.com", "ktronix.com", "tienda.claro.com.co", "tienda.movistar.com.co",
            "wom.co/equiposcategory8", "virginmobile.co/marketplace", "panamericana.com.co",
            "falabella.com.co", "pepeganga.com", "locatelcolombia.com", "bellapiel.com.co",
            "farmatodo.com.co", "cruzverde.com.co", "larebajavirtual.com", "drogueriasalemana.com",
            "drogueriasdeldrsimi.co", "tiendasisimo.com", "drogueriascolsubsidio.com",
            "homecenter.com.co", "easy.com.co", "ikea.com/co/es", "homesentry.co",
            "decathlon.com.co", "dafiti.com.co", "cromantic.com"
        ];

        // Define la herramienta de búsqueda web como 'function' y pasa el arreglo de dominios
        const payload = {
            model: this.model,
            messages: [{role: "user", content: prompt}],
            response_format: {type: "json_object"},
            tools: [{
                type: "function",
                function: {
                    name: "web_search",
                    description: "Busca en la web para obtener información actualizada sobre precios de productos en tiendas online.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "La consulta de búsqueda optimizada para encontrar productos y precios."
                            }
                        },
                        required: ["query"]
                    }
                }
            }],
            // Indicamos al modelo que puede elegir usar la herramienta o responder directamente (para el JSON final).
            tool_choice: "auto"
        };
        const tokenLimit = this._sanitizeTokenLimit(this.maxTokens);

        if (tokenLimit) {
            payload.max_completion_tokens = tokenLimit;  // ¡Cambiado de 'max_tokens' a 'max_completion_tokens'!
        }

        try {
            // Ejecutar la solicitud a la API de OpenAI
            const response = await this.client.chat.completions.create(payload);

            const choice = response?.choices?.[0];
            const message = choice?.message;

            if (!message) {
                const finishReason = choice?.finish_reason || 'unknown';
                console.error(`❌ [OpenAIClient] Respuesta incompleta o filtrada. Razón: ${finishReason}`);
                throw new Error("OpenAI no devolvió un mensaje válido. Razón de finalización: " + finishReason);
            }

            const rawContent = this._extractContent(choice);
            if (rawContent) {
                return rawContent;
            }

            console.error("❌ [OpenAIClient] Contenido extraíble nulo/vacío. Mensaje crudo:", JSON.stringify(message).substring(0, 500) + '...');
            throw new Error("OpenAI no devolvió contenido interpretable en la respuesta (Contenido vacío o inesperado).");

        } catch (error) {
            console.error(`🔥 [OpenAIClient] Error de la API o red: ${error.message}`);
            throw error;
        }
    }

    _extractContent(choice) {
        const message = choice?.message;
        if (!message) return null;

        if (typeof message.content === "string") {
            const text = message.content.trim();
            if (text) return text;
        }

        if (Array.isArray(message.content)) {
            const text = message.content
                .map(part => {
                    if (typeof part === "string") return part;
                    if (typeof part?.text === "string") return part.text;
                    if (typeof part?.content === "string") return part.content;
                    if (part?.type === "output_text" && typeof part?.text === "string") return part.text;
                    return "";
                })
                .join("")
                .trim();
            if (text) return text;
        }

        const toolArgs = message?.tool_calls?.[0]?.function?.arguments;
        if (typeof toolArgs === "string" && toolArgs.trim()) {
            return toolArgs.trim();
        }

        if (typeof choice?.text === "string" && choice.text.trim()) {
            return choice.text.trim();
        }

        return null;
    }

    _sanitizeTokenLimit(value) {
        const parsed = Number(value);

        if (!Number.isFinite(parsed) || parsed <= 0) {
            return null;
        }
        return Math.floor(parsed);
    }
}

module.exports = OpenAIClient;