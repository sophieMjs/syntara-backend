const mongoose = require('mongoose');

class SearchEntity {
    constructor({ userId = null, product, quantity = 1, unit = null, stores = [], results = [], timestamp = new Date() } = {}) {
        this.userId = userId;
        this.query = {
            product,
            quantity,
            unit,
            stores
        };
        this.results = results;
        this.timestamp = timestamp;
    }
}


const searchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    query: {
        product: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: null },
        stores: [{ type: String }]
    },
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PriceRecord' }],
    timestamp: { type: Date, default: Date.now }
});

searchSchema.index({ userId: 1, timestamp: -1 });

const SearchModel = mongoose.model('Search', searchSchema);

module.exports = { SearchEntity, SearchModel };
