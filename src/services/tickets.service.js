import TicketModel from '../models/ticket.model.js';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

class TicketService {
    async createTicket(cartId, userId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const purchasedProducts = [];
            const failedProducts = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityRequested = item.quantity;

                // Verifica disponibilidad del producto
                if (product.stock >= quantityRequested) {
                    // Si hay stock suficiente, actualiza el stock del producto
                    product.stock -= quantityRequested;
                    await product.save(); // Guarda los cambios en el stock
                    purchasedProducts.push({
                        productId: product._id,
                        quantity: quantityRequested
                    });
                } else {
                    // Si no hay stock suficiente, agrega el producto a la lista de fallidos
                    failedProducts.push(product._id);
                }
            }

            // Generar el ticket si hay productos comprados
            if (purchasedProducts.length > 0) {
                const ticket = await TicketModel.create({
                    userId,
                    products: purchasedProducts,
                    createdAt: new Date()
                });

                // Actualizar el carrito para eliminar los productos comprados
                cart.products = cart.products.filter(item => !purchasedProducts.some(p => p.productId.equals(item.product)));
                await cart.save(); // Guarda el carrito actualizado

                return { ticket, failedProducts };
            } else {
                // Si no se compró ningún producto, devuelve el arreglo de productos fallidos
                return { ticket: null, failedProducts };
            }
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            throw new Error("Error al procesar la compra");
        }
    }
}

export default new TicketService();
