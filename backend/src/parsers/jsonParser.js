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

        repaired = repaired.replace(/([\{,]\s*)([A-Za-z0-9_]+)\s*:/g, (match, prefix, key) => {
            return `${prefix}"${key}":`;
        });

        repaired = repaired.replace(/'([^']*)'/g, '"$1"');

        repaired = repaired.replace(/,\s*([\}\]])/g, "$1");

        if (repaired !== jsonLike) {
            return repaired;
        }

        return null;
    }
}

module.exports = JSONParser;