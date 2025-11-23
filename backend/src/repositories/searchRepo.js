const { SearchModel } = require("../models/Search");
const mongoose = require("mongoose");

class SearchRepository {

    async create(data) {
        const search = new SearchModel(data);
        return await search.save();
    }


    async findUserHistory(userId, limit = 20) {
        return SearchModel.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate("results")
            .exec();
    }


    async countSearchesThisMonth(userId) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const filter = {
            timestamp: { $gte: start, $lt: end }
        };

        if (userId) {
            filter.userId = new mongoose.Types.ObjectId(userId);
        } else {
            filter.userId = null;
        }

        return SearchModel.countDocuments(filter).exec();
    }

    async deleteUserHistory(userId) {
        return SearchModel.deleteMany({ userId: userId }).exec();
    }

    async findTopSearchedProductsByStore(storeName, limit = 10) {
        return await SearchModel.aggregate([
            {
                $lookup: {
                    from: "pricerecords",
                    localField: "results",
                    foreignField: "_id",
                    as: "resultDetails"
                }
            },
            {
                $match: {
                    "resultDetails.store": new RegExp(storeName, "i")
                }
            },
            {
                $group: {
                    _id: "$query.product",
                    searchCount: { $sum: 1 },
                    lastSearchDate: { $max: "$timestamp" }
                }
            },
            { $sort: { searchCount: -1 } },
            { $limit: limit }
        ]);
    }


    async countSearchesToday(userId) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const filter = {
            timestamp: { $gte: start, $lt: end }
        };

        if (userId) {
            filter.userId = new mongoose.Types.ObjectId(userId);
        } else {
            filter.userId = null;
        }

        return SearchModel.countDocuments(filter).exec();
    }
}

module.exports = new SearchRepository();