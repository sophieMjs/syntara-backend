// repositories/priceRecordRepo.js

const { PriceRecordModel } = require("../models/PriceRecord");

class PriceRecordRepository {

    async create(data) {
        const record = new PriceRecordModel(data);
        return await record.save();
    }

    async createMany(records) {
        return await PriceRecordModel.insertMany(records);
    }

    async findById(id) {
        return PriceRecordModel.findById(id).exec();
    }

    async findByQueryId(queryId) {
        return PriceRecordModel.find({ "metadata.queryId": queryId }).exec();
    }

    async findLatestByProduct(normalizedProduct, limit = 10) {
        return PriceRecordModel.find({ normalizedProduct })
            .sort({ date: -1 })
            .limit(limit)
            .exec();
    }

    async findByProductAndStore(normalizedProduct, store) {
        return PriceRecordModel.findOne({ normalizedProduct, store }).exec();
    }

    /**
     * Devuelve el histórico completo (o por rango) de precios para un producto.
     * Útil para generar reportes de inteligencia de mercado.
     */
    async getHistoricalPrices(normalizedProduct, limit = 0) {
        const q = { normalizedProduct };
        const query = PriceRecordModel.find(q).sort({ date: 1 }); // ascendente por fecha
        if (limit && limit > 0) query.limit(limit);
        return query.exec();
    }
}

module.exports = new PriceRecordRepository();
