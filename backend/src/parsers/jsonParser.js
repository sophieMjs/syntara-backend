// parsers/jsonParser.js
class JSONParser {
    parse(text) {
        if (!text) throw new Error("Respuesta vacía del modelo.");

        try {
            return JSON.parse(text);
        } catch {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {

                try {
                    return JSON.parse(match[0]);
                } catch (innerErr) {
                    const repaired = this._repairJson(match[0]);
                    if (repaired) {
                        try {
                            return JSON.parse(repaired);
                        } catch (repairErr) {
                            // Continuar y lanzar el error genérico al final
                        }
                    }
                }
            }
            throw new Error("La respuesta no tiene formato JSON válido.");
        }
    }

    _repairJson(jsonLike) {
        if (!jsonLike) return null;

        let repaired = jsonLike;

        // Asegurar que las claves estén entre comillas
        repaired = repaired.replace(/([\{,]\s*)([A-Za-z0-9_]+)\s*:/g, (match, prefix, key) => {
            return `${prefix}"${key}":`;
        });

        // Normalizar comillas simples en cadenas a comillas dobles
        repaired = repaired.replace(/'([^']*)'/g, '"$1"');

        // Eliminar posibles comas colgantes
        repaired = repaired.replace(/,\s*([\}\]])/g, "$1");

        if (repaired !== jsonLike) {
            return repaired;
        }

        return null;
    }
}

module.exports = JSONParser;