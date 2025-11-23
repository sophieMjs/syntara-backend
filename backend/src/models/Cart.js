const mongoose = require('mongoose');
class CartEntity {
    constructor({ userId, items = [], updatedAt = new Date() }) {
        this.userId = userId;
        this.items = items;
        this.updatedAt = updatedAt;
    }
}

const cartItemSchema = new mongoose.Schema({
    productId: { type: String },
    product: { type: String, required: true },
    price: { type: Number, required: true },
    store: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'unidad' },
    url: { type: String },
    // SE ELIMINÓ EL CAMPO IMAGE
    addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now }
});

cartSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = { CartEntity, CartModel };