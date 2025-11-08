// services/propmtBuilders/reportPromptBuilder.js
// ReportPromptBuilder adaptado para exponer los métodos usados por ReportService.
// Este archivo se integra con PromptBuilderFactory.

const IPromptBuilder = require("./IPromptBuilder");

class ReportPromptBuilder extends IPromptBuilder {
    // método original para generar resumen de comparación (nombre legible)
    buildPriceComparisonPrompt({ product, storeData }) {
        return `
Genera un análisis profesional sobre la comparación de precios del producto:

Producto: "${product}"

Datos:
${JSON.stringify(storeData, null, 2)}

Instrucciones:
- Identificar la tienda más económica.
- Calcular diferencia porcentual entre la tienda más barata y el resto.
- Evaluar variabilidad entre tiendas (desviación o rango).
- Proveer insights accionables (ej. si conviene comprar ahora, cambiar marca, esperar).
- Si hay anomalías (precios mucho más altos o bajos), identificar.

Devuelve SOLO TEXTO en español (sin JSON).
        `;
    }

    // método original para análisis de mercado
    buildMarketAnalysisPrompt(records) {
        return `
Eres un analista económico. Analiza los siguientes precios históricos:

${JSON.stringify(records, null, 2)}

Instrucciones:
- Identifica la tendencia general (subida, bajada, estable).
- Detecta picos anómalos (fechas y posibles causas).
- Indica si existe estacionalidad o patrón semanal/mensual.
- Entrega conclusiones accionables y una breve recomendación.

Devuelve SOLO TEXTO en español.
        `;
    }

    /* --- Wrappers para compatibilidad ---
       El ReportService original usaba nombres diferentes:
       - buildPriceSummaryPrompt
       - buildMarketIntelligencePrompt
       Para evitar modificar el ReportService en muchos puntos, expongo estos wrappers.
    */

    buildPriceSummaryPrompt(params) {
        // mantiene compatibilidad con callers que usan "buildPriceSummaryPrompt"
        return this.buildPriceComparisonPrompt(params);
    }

    buildMarketIntelligencePrompt(records) {
        // mantiene compatibilidad con callers que usan "buildMarketIntelligencePrompt"
        return this.buildMarketAnalysisPrompt(records);
    }
}

module.exports = ReportPromptBuilder;
