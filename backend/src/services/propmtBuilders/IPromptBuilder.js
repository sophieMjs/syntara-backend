// services/promptBuilders/IPromptBuilder.js
// Interfaz conceptual: asegura consistencia entre todos los builders

class IPromptBuilder {
    buildPrompt() {
        throw new Error("Método buildPrompt() debe ser implementado.");
    }
}

module.exports = IPromptBuilder;
