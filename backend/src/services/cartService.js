const CartRepository = require("../repositories/cartRepo");

class CartService {
    constructor() {
        this.cartRepo = CartRepository;
    }


    async getCart(userId) {
        let cart = await this.cartRepo.findByUserId(userId);
        if (!cart) {
            cart = await this.cartRepo.createEmptyCart(userId);
        }
        return cart;
    }

    async addItem(userId, itemData) {
        let cart = await this.getCart(userId);

        if (!itemData.product || !itemData.price || !itemData.store) {
            throw new Error("Datos del producto incompletos (se requiere product, price, store).");
        }

        const existingIndex = cart.items.findIndex(
            (i) => i.product === itemData.product && i.store === itemData.store
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += (Number(itemData.quantity) || 1);
            cart.items[existingIndex].price = Number(itemData.price);
        } else {
            cart.items.push({
                productId: itemData.id || null,
                product: itemData.product,
                price: Number(itemData.price),
                store: itemData.store,
                url: itemData.url || null,
                unit: itemData.unit || 'unidad',
                quantity: Number(itemData.quantity) || 1
            });
        }

        return await this.cartRepo.saveCart(cart);
    }


    async removeItem(userId, itemId) {
        let cart = await this.getCart(userId);

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        return await this.cartRepo.saveCart(cart);
    }

    async clearCart(userId) {
        return await this.cartRepo.clearCart(userId);
    }


    async getCartWithTotals(userId) {
        const cart = await this.getCart(userId);

        const total = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items,
            totalCount: cart.items.length,
            totalPrice: total,
            updatedAt: cart.updatedAt
        };
    }
}

module.exports = new CartService();