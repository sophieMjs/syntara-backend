// backend/src/services/cartService.js
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

        // itemData espera: { productId, product, price, store, url, quantity... }

        // Verificar si el producto ya existe en el carrito (misma tienda y nombre)
        const existingIndex = cart.items.findIndex(
            (i) => i.product === itemData.product && i.store === itemData.store
        );

        if (existingIndex > -1) {
            // Si existe, sumamos la cantidad
            cart.items[existingIndex].quantity += (itemData.quantity || 1);
            // Actualizamos precio si cambió (opcional, aquí asumimos que queremos el último)
            cart.items[existingIndex].price = itemData.price;
        } else {
            // Si no existe, pusheamos
            cart.items.push({
                productId: itemData.id || null, // El ID del PriceRecord
                product: itemData.product,
                price: itemData.price,
                store: itemData.store,
                url: itemData.url,
                unit: itemData.unit,
                quantity: itemData.quantity || 1
            });
        }

        return await this.cartRepo.saveCart(cart);
    }

    async removeItem(userId, itemId) {
        let cart = await this.getCart(userId);

        // Filtramos para quitar el item por su _id (generado por Mongo dentro del array)
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        return await this.cartRepo.saveCart(cart);
    }

    async clearCart(userId) {
        let cart = await this.getCart(userId);
        cart.items = [];
        return await this.cartRepo.saveCart(cart);
    }

    // Calcular total estimado
    async getCartTotal(userId) {
        const cart = await this.getCart(userId);
        const total = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return {
            items: cart.items,
            totalCount: cart.items.length,
            totalPrice: total
        };
    }
}

module.exports = new CartService();