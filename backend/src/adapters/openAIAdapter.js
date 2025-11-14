// adapters/openAIAdapter.js
const OpenAIClient = require("../clients/openAIClient");
const ParserFactory = require("../factories/parserFactory"); // 1. Importar
const { PriceRecordEntity } = require("../models/PriceRecord"); // 2. Importar

class OpenAIAdapter {
    constructor() {
        // 💡 LOG DE DIAGNÓSTICO EN EL ADAPTER
        console.log("⚙️ [OpenAIAdapter] Constructor ejecutado.");

        // --- INICIO DE LA CORRECCIÓN ---
        // Verificar la clave de API (asumiendo que está en process.env)
        // Esta verificación debe ocurrir ANTES de instanciar el cliente.
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
            console.error("❌ ERROR CRÍTICO: La variable de entorno OPENAI_API_KEY no está definida o está vacía.");
            // Lanzar una excepción para forzar la captura en el controlador
            throw new Error("Clave de API de OpenAI (OPENAI_API_KEY) ausente o vacía.");
        }
        // --- FIN DE LA CORRECCIÓN ---

        this.client = new OpenAIClient();
        this.parserFactory = new ParserFactory(); // 3. Instanciar

        console.log("⚙️ [OpenAIAdapter] Cliente y ParserFactory inicializados.");
    }

    // 4. Cambiar el nombre del método para que coincida con el diagrama
    async toPriceRecords(prompt) {

        console.log("➡️ [OpenAIAdapter] 5.1. Enviando prompt a OpenAIClient...");

        let rawResponse;
        try {
            rawResponse = await this.client.sendPrompt(prompt);
        } catch (err) {
            console.error("[OpenAIAdapter] Error al comunicarse con OpenAI:", err.message);
            throw new Error("No se pudo obtener respuesta de OpenAI.");
        }

        console.log("✅ [OpenAIAdapter] 5.2. Respuesta de IA recibida. Parseando...");

        // 5. Mover la lógica de parseo y conversión aquí
        try {
            const parser = this.parserFactory.getParser("json");
            const parsed = parser.parse(rawResponse);

            // Convertir el JSON genérico en entidades de tu dominio
            return (parsed.results || []).map(r => new PriceRecordEntity(r));

        } catch (err) {
            console.error("[OpenAIAdapter] Error al parsear respuesta:", err.message);
            console.error("[OpenAIAdapter] Respuesta cruda que falló:", rawResponse);
            throw new Error("La respuesta de OpenAI no pudo ser procesada.");
        }
    }
}

module.exports = OpenAIAdapter;