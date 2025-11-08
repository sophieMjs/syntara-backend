// services/promptBuilders/searchPromptBuilder.js

const IPromptBuilder = require("./IPromptBuilder");

class SearchPromptBuilder extends IPromptBuilder {
    buildPrompt({ product, quantity, unit, stores }) {
        return `
Eres un asistente especializado en obtener precios reales y actualizados de productos en tiendas DE COLOMBIA.

Debes devolver EXCLUSIVAMENTE un JSON limpio y válido.

Producto: "${product}"
Cantidad: ${quantity}
Unidad: ${unit || "N/A"}

Tiendas a consultar:
${stores.join(", ")}

Formato OBLIGATORIO de respuesta:
{
  "results": [
    {
      "product": "string",
      "store": "string",
      "price": number,
      "unitPrice": number|null,
      "currency": "COP",
      "url": "string|null",
      "date": "YYYY-MM-DD",
      "confidence": number
    }
  ]
}

No incluyas explicación, comentarios ni texto fuera del JSON.
        `;
    }
}

module.exports = SearchPromptBuilder;
