// repositories/searchRepo.js
const { SearchModel } = require("../models/Search");
const mongoose = require("mongoose");

class SearchRepository {

    async create(data) {
        const search = new SearchModel(data);
        return await search.save();
    }

    async findById(id) {
        return SearchModel.findById(id)
            .populate("results")
            .exec();
    }

    async findUserHistory(userId, limit = 20) {
        return SearchModel.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();
    }

    async addPriceRecord(searchId, recordId) {
        return SearchModel.findByIdAndUpdate(
            searchId,
            { $push: { results: recordId } },
            { new: true }
        ).exec();
    }

    /**
     * Cuenta las búsquedas de un usuario en el mes actual.
     * Útil para límites mensuales en SubscriptionService.
     */
    async countSearchesThisMonth(userId) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const filter = {
            timestamp: { $gte: start, $lt: end }
        };

        if (userId) {
            filter.userId = mongoose.Types.ObjectId(userId);
        } else {
            // si no hay userId, contar búsquedas sin usuario
            filter.userId = null;
        }

        return SearchModel.countDocuments(filter).exec();
    }
}

module.exports = new SearchRepository();
