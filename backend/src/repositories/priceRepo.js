const { PriceRecordModel } = require("../models/PriceRecord");

class PriceRecordRepository {

    async create(data) {
        const record = new PriceRecordModel(data);
        return await record.save();
    }

    async findLatestByProduct(normalizedProduct, limit = 10) {
        const regex = new RegExp(normalizedProduct, "i");
        return PriceRecordModel.find({ normalizedProduct: { $regex: regex } })
            .sort({ date: -1 })
            .limit(limit)
            .exec();
    }

    async getHistoricalPrices(normalizedProduct, limit = 0) {
        const regex = new RegExp(normalizedProduct, "i");
        const q = { normalizedProduct: { $regex: regex } };

        const query = PriceRecordModel.find(q).sort({ date: 1 });
        if (limit && limit > 0) query.limit(limit);
        return query.exec();
    }

    async findDistinctProductsByStore(storeName) {
        return await PriceRecordModel.distinct("normalizedProduct", {
            store: new RegExp(`^${storeName}$`, "i")
        });
    }

    async findLatestPricesForManyProducts(productList) {
        return await PriceRecordModel.aggregate([
            {
                $match: {
                    normalizedProduct: { $in: productList }
                }
            },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: { product: "$normalizedProduct", store: "$store" },
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } }
        ]);
    }

    async getPriceHistoryMany(productNames) {
        return await PriceRecordModel.aggregate([
            {
                $match: { normalizedProduct: { $in: productNames } }
            },
            { $sort: { date: 1 } },
            {
                $group: {
                    _id: "$normalizedProduct",
                    history: {
                        $push: {
                            price: "$price",
                            date: "$date",
                            store: "$store"
                        }
                    },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
    }
}

module.exports = new PriceRecordRepository();