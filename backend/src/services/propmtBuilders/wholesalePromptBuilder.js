

const IPromptBuilder = require("./IPromptBuilder");

class WholesalePromptBuilder extends IPromptBuilder {
    buildPrompt({ product, quantity, unit }) {


        const targetDomains = [
            "makro.com.co",
            "surtimayorista.com",
            "pricesmart.com",
            "elmayorista.com",
            "alkosto.com",
            "bodegadelcanasto.com",
            "bermudas.com.co",
            "suministroseimpresos.com",
            "madrugon.com",
            "corabastos.com.co",
            "tecnologiamayorista.com",
            "distribuidoraelfaro.com",
            "mercadolibre.com.co",
            "exito.com",
            "jumbo.com.co",
            "eurosupermercados.com"
        ];

        const domainsString = targetDomains.join(", ");

        return `
Eres un agente extractor de precios MAYORISTAS EXTREMADAMENTE FLEXIBLE. 
Tu objetivo es buscar el PRODUCTO solicitado con la presentación indicada (Volumen/Mayorista).

IMPORTANTE: USA la herramienta 'web_search' para buscar precios en Colombia.

Busca combinaciones como:
- "precio ${product} mayorista Colombia"
- "${product} ${quantity} ${unit || "unidades"} precio bulto caja"
- "${product} paca precio"
- "distribuidora ${product} bogotá precio"

Devuelve la MAYOR CANTIDAD POSIBLE de resultados. Apunta a encontrar al menos 5 opciones.

VARIABLES:
PRODUCTO = "${product}"
CANTIDAD = ${quantity}
UNIDAD = "${unit || "unidad"}"
PRESENTACION = "${quantity} ${unit || "unidad"}"
CIUDAD = "Bogotá"

TIENDAS_OBJETIVO = [${domainsString}]

REGLAS DE BÚSQUEDA Y FLEXIBILIDAD (CRÍTICO):

1. *PRIORIDAD, NO EXCLUSIVIDAD*:
   - Busca primero en los dominios de TIENDAS_OBJETIVO.
   - SI NO encuentras resultados ahí, O si encuentras buenas ofertas mayoristas en otras tiendas colombianas confiables, *INCLÚYELAS TAMBIÉN*.
   - No filtres resultados solo porque la tienda no está en la lista, siempre y cuando parezca un proveedor legítimo en Colombia.

2. *INTERPRETACIÓN DE "MAYORISTA"*:
   - Busca presentaciones grandes: "Caja", "Bulto", "Paca", "Display", "Canastilla", "Saco".
   - Si el usuario pide "1 Bulto" y encuentras "1 Kilo", PERO la tienda vende "por mayor" o tiene precio de distribuidor, inclúyelo (marcando la diferencia en el nombre).
   - Si encuentras el producto por unidad suelta en un supermercado (ej: Exito), inclúyelo SOLO si no hay mejores opciones mayoristas reales, para tener una referencia de precio máximo.

3. *EXTRACCIÓN DE PRECIOS*:
   - Extrae el precio tal cual aparece en el HTML.
   - Si hay "Precio por caja" y "Precio por unidad", prefiere el precio total de la presentación buscada (Caja/Bulto).
   - Si la página requiere cotizar ("Llamar para precio"), ignórala. Solo queremos precios visibles.

FORMATO OBLIGATORIO DEL JSON FINAL:
{
  "results": [
    {
      "product": "Nombre encontrado en la tienda",
      "normalizedProduct": "${product}",
      "store": "Nombre de la tienda",
      "price": 10000,
      "currency": "COP",
      "url": "https://...",
      "date": "YYYY-MM-DD",
      "isOffer": boolean
    }
  ]
}

Si no encuentras NADA exacto, busca productos similares (ej: otra marca de arroz por bulto) y devuélvelos.
NUNCA devuelvas un array vacío si puedes encontrar al menos una referencia de precio en el mercado.
`;
    }
}

module.exports = WholesalePromptBuilder;