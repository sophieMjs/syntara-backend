const { CartModel } = require("../models/Cart");

class CartRepository {
    async findByUserId(userId) {
        return CartModel.findOne({ userId });
    }

    async createEmptyCart(userId) {
        return CartModel.create({ userId, items: [] });
    }

    async saveCart(cartDocument) {
        cartDocument.updatedAt = new Date();
        return cartDocument.save();
    }

    async clearCart(userId) {
        return CartModel.findOneAndDelete({ userId });
    }
}

module.exports = new CartRepository();