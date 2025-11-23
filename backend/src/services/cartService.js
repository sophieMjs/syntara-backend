// backend/src/services/cartService.js
const CartRepository = require("../repositories/cartRepo");

class CartService {
    constructor() {
        this.cartRepo = CartRepository;
    }

    /**
     * Obtiene el carrito del usuario, si no existe lo crea.
     */
    async getCart(userId) {
        let cart = await this.cartRepo.findByUserId(userId);
        if (!cart) {
            cart = await this.cartRepo.createEmptyCart(userId);
        }
        return cart;
    }

    /**
     * Agrega un ítem al carrito o actualiza su cantidad.
     * Recibe datos desde el frontend (resultado de búsqueda).
     */
    async addItem(userId, itemData) {
        let cart = await this.getCart(userId);

        // Validamos datos mínimos
        if (!itemData.product || !itemData.price || !itemData.store) {
            throw new Error("Datos del producto incompletos (se requiere product, price, store).");
        }

        // Buscar si el producto ya existe en el carrito (misma tienda y nombre)
        const existingIndex = cart.items.findIndex(
            (i) => i.product === itemData.product && i.store === itemData.store
        );

        if (existingIndex > -1) {
            // Si existe, sumamos la cantidad
            cart.items[existingIndex].quantity += (Number(itemData.quantity) || 1);
            // Actualizamos precio por si bajó o subió en la nueva búsqueda
            cart.items[existingIndex].price = Number(itemData.price);
        } else {
            // Si no existe, lo agregamos (SIN IMAGEN)
            cart.items.push({
                productId: itemData.id || null, // ID del PriceRecord si viene
                product: itemData.product,
                price: Number(itemData.price),
                store: itemData.store,
                url: itemData.url || null,
                unit: itemData.unit || 'unidad',
                quantity: Number(itemData.quantity) || 1
                // image: ELIMINADO
            });
        }

        return await this.cartRepo.saveCart(cart);
    }

    /**
     * Elimina un ítem específico del carrito usando el _id del ítem.
     */
    async removeItem(userId, itemId) {
        let cart = await this.getCart(userId);

        // Filtramos el array de items
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        return await this.cartRepo.saveCart(cart);
    }

    /**
     * Actualiza la cantidad de un ítem específico.
     */
    async updateItemQuantity(userId, itemId, quantity) {
        let cart = await this.getCart(userId);

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Si la cantidad es 0 o menor, eliminamos el item
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            return await this.cartRepo.saveCart(cart);
        }

        return cart;
    }

    /**
     * Vacía el carrito.
     */
    async clearCart(userId) {
        return await this.cartRepo.clearCart(userId);
    }

    /**
     * Obtiene el carrito con totales calculados.
     */
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