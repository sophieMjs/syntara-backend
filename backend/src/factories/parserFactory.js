const JSONParser = require("../parsers/jsonParser");

class ParserFactory {
    getParser(type) {
        switch (type) {
            case "json":
                return new JSONParser();
            default:
                throw new Error(`Tipo de parser desconocido: ${type}`);
        }
    }
}

module.exports = ParserFactory;
