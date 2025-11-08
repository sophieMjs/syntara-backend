// src/services/priceRecordService.js

const priceRepo = require("../repositories/priceRecordRepo");

class PriceRecordService {

    /**
     * Obtener un registro por ID
     */
    async getById(id) {
        return priceRepo.findById(id);
    }

    /**
     * Obtener precios recientes de un producto
     */
    async getRecentPrices(normalizedProduct, limit = 10) {
        return priceRepo.findLatestByProduct(normalizedProduct, limit);
    }

    /**
     * Obtener precio más económico entre una lista de tiendas
     */
    async getBestPrice(normalizedProduct, stores = []) {
        const prices = await priceRepo.findLatestByProduct(normalizedProduct, 50);

        if (!prices.length) return null;

        let filtered = prices;

        if (stores.length > 0) {
            filtered = prices.filter(p => stores.includes(p.store));
        }

        return filtered.sort((a, b) => a.price - b.price)[0] || null;
    }

    /**
     * Obtener precios filtrados por tienda
     */
    async getByStore(normalizedProduct, store) {
        return priceRepo.findByProductAndStore(normalizedProduct, store);
    }
}

module.exports = new PriceRecordService();
