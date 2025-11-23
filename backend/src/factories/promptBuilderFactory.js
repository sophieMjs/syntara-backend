// factories/promptBuilderFactory.js
const SearchPromptBuilder = require("../services/propmtBuilders/searchPromptBuilder");
const ReportPromptBuilder = require("../services/propmtBuilders/reportPromptBuilder");
const WholesalePromptBuilder = require("../services/propmtBuilders/wholesalePromptBuilder"); // <--- IMPORTAR

class PromptBuilderFactory {
    getPromptBuilder(type) {
        switch (type) {
            case "search":
                return new SearchPromptBuilder();
            case "report":
                return new ReportPromptBuilder();
            case "wholesale": // <--- NUEVO CASO
                return new WholesalePromptBuilder();
            default:
                throw new Error(`Tipo de PromptBuilder desconocido: ${type}`);
        }
    }
}

module.exports = PromptBuilderFactory;