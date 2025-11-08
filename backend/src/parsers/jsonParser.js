// parsers/jsonParser.js
class JSONParser {
    parse(text) {
        if (!text) throw new Error("Respuesta vacía del modelo.");

        try {
            return JSON.parse(text);
        } catch {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error("La respuesta no tiene formato JSON válido.");
        }
    }
}

module.exports = JSONParser;
