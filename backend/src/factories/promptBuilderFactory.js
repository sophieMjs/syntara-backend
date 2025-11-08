// factories/promptBuilderFactory.js
// Factory que crea PromptBuilders desde la carpeta services/propmtBuilders

const SearchPromptBuilder = require("../services/propmtBuilders/searchPromptBuilder");
const ReportPromptBuilder = require("../services/propmtBuilders/reportPromptBuilder");

class PromptBuilderFactory {
    getPromptBuilder(type) {
        switch (type) {
            case "search":
                return new SearchPromptBuilder();
            case "report":
                return new ReportPromptBuilder();
            default:
                throw new Error(`Tipo de PromptBuilder desconocido: ${type}`);
        }
    }
}

module.exports = PromptBuilderFactory;
