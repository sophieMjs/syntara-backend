// services/searchService.js
const PromptBuilderFactory = require("../factories/promptBuilderFactory");
const ParserFactory = require("../factories/parserFactory");
const SearchRepository = require("../repositories/searchRepo");
const PriceRecordRepository = require("../repositories/priceRepo");
const OpenAIAdapter = require("../adapters/openAIAdapter");

class SearchService {
    constructor() {
        this.promptFactory = new PromptBuilderFactory();
        this.parserFactory = new ParserFactory();
        this.searchRepo = new SearchRepository();
        this.priceRepo = new PriceRecordRepository();
        this.ai = new OpenAIAdapter();
    }

    async search({ userId, product, quantity = 1, unit = null, stores = [] }) {
        // 1️⃣ Construir el prompt
        const builder = this.promptFactory.getPromptBuilder("search");
        const prompt = builder.buildPrompt({ product, quantity, unit, stores });

        // 2️⃣ Enviar al modelo
        const aiResponse = await this.ai.request(prompt);

        // 3️⃣ Parsear respuesta
        const parser = this.parserFactory.getParser("json");
        const parsed = parser.parse(aiResponse);
        const results = parsed.results || [];

        // 4️⃣ Guardar registros en BD
        const savedRecords = [];
        for (const r of results) {
            const record = await this.priceRepo.create({
                product: r.product,
                normalizedProduct: r.product.toLowerCase(),
                store: r.store,
                price: r.price,
                unitPrice: r.unitPrice || null,
                currency: r.currency || "COP",
                date: new Date(r.date),
                url: r.url || null,
                raw: r,
                metadata: { confidence: r.confidence || 1.0 }
            });
            savedRecords.push(record);
        }

        // 5️⃣ Registrar búsqueda
        const searchLog = await this.searchRepo.create({
            userId,
            product,
            quantity,
            unit,
            stores,
            results: savedRecords.map(r => r._id)
        });

        return {
            searchId: searchLog._id,
            product,
            results: savedRecords
        };
    }
}

module.exports = SearchService;
