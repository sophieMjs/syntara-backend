// adapters/openAIAdapter.js
const OpenAIClient = require("../clients/openAIClient");

class OpenAIAdapter {
    constructor() {
        this.client = new OpenAIClient();
    }

    async request(prompt) {
        try {
            const response = await this.client.sendPrompt(prompt);
            return response;
        } catch (err) {
            console.error("[OpenAIAdapter] Error al comunicarse con OpenAI:", err.message);
            throw new Error("No se pudo obtener respuesta de OpenAI.");
        }
    }
}

module.exports = OpenAIAdapter;
