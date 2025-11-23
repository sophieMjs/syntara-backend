// backend/src/models/Cart.js
const mongoose = require('mongoose');

class CartItemEntity {
    constructor({ productId, product, price, store, quantity = 1, unit = 'unidad', url = null, image = null }) {
        this.productId = productId; // ID del PriceRecord original (opcional)
        this.product = product;
        this.price = Number(price);
        this.store = store;
        this.quantity = Number(quantity);
        this.unit = unit;
        this.url = url;
        this.image = image;
    }
}

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            productId: { type: String }, // Referencia al ID del PriceRecord (opcional)
            product: { type: String, required: true },
            price: { type: Number, required: true },
            store: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            unit: { type: String },
            url: { type: String },
            image: { type: String },
            addedAt: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = { CartItemEntity, CartModel };