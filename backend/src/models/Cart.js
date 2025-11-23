// backend/src/models/Cart.js
const mongoose = require('mongoose');

// Entidad para uso interno si fuera necesario instanciarla manualmente
class CartEntity {
    constructor({ userId, items = [], updatedAt = new Date() }) {
        this.userId = userId;
        this.items = items;
        this.updatedAt = updatedAt;
    }
}

// Esquema de un ítem dentro del carrito
const cartItemSchema = new mongoose.Schema({
    productId: { type: String }, // Puede ser el ID del PriceRecord o null
    product: { type: String, required: true },
    price: { type: Number, required: true },
    store: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'unidad' },
    url: { type: String },
    // SE ELIMINÓ EL CAMPO IMAGE
    addedAt: { type: Date, default: Date.now }
});

// Esquema principal del Carrito
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now }
});

// Middleware para actualizar fecha automáticamente antes de guardar
cartSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = { CartEntity, CartModel };