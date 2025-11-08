// parsers/IParser.js
// Interfaz conceptual para todos los parsers.

class IParser {
    parse(rawText) {
        throw new Error("El método parse() debe ser implementado por cada parser.");
    }
}

module.exports = IParser;
