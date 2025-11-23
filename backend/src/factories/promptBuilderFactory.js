const SearchPromptBuilder = require("../services/propmtBuilders/searchPromptBuilder");
const WholesalePromptBuilder = require("../services/propmtBuilders/wholesalePromptBuilder"); // <--- IMPORTAR

class PromptBuilderFactory {
    getPromptBuilder(type) {
        switch (type) {
            case "search":
                return new SearchPromptBuilder();
            case "wholesale":
                return new WholesalePromptBuilder();
            default:
                throw new Error(`Tipo de PromptBuilder desconocido: ${type}`);
        }
    }
}

module.exports = PromptBuilderFactory;