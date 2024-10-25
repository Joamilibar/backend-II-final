// En tu controlador de compras (p.ej., purchases.controller.js)
import CartModel from '../dao/models/cart.model.js'; // Asegúrate de tener la ruta correcta
import TicketService from '../services/ticket.service.js'; // Asegúrate de tener la ruta correcta
import ProductModel from '../dao/models/product.model.js'; // Para verificar la disponibilidad

const finalizePurchase = async (req, res) => {
    const cartId = req.params.cid; // Obtener el ID del carrito desde la solicitud

    // Busca el carrito
    const cart = await CartModel.findById(cartId).populate('products.product');

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ success: false, message: "El carrito está vacío." });
    }
    const product = await ProductModel.findById(item.product._id);
    if (product) {
        // Verifica el stock

        // Verifica la disponibilidad de los productos
        const availableProducts = [];
        const unprocessedIds = [];


        for (const item of cart.products) {
            const product = await ProductModel.findById(item.product._id);
            if (product && product.stock >= item.quantity) {
                availableProducts.push(item); // Agregar productos disponibles
                // Reducir el stock
                product.stock -= item.quantity;
                await product.save();
            } else {
                unprocessedIds.push(item.product); // Agregar IDs de productos no procesados
            }
        }
    } else {
        unprocessedIds.push(item.product);
    }
    console.log("Cart:", cart);
    console.log("Available Products:", availableProducts);
    console.log("Unprocessed IDs:", unprocessedIds);

    // Genera el ticket con los productos disponibles
    const ticket = await TicketService.createTicket(cart, availableProducts);

    // Actualiza el carrito, manteniendo solo los productos no procesados
    cart.products = cart.products.filter(item => unprocessedIds.includes(item.product._id));
    await cart.save();

    if (ticket) {
        return res.json({ success: true, unprocessedIds });
    } else {
        return res.status(500).json({ success: false, message: "Error al procesar la compra." });
    }
};

// Asegúrate de agregar esta ruta en tu archivo de rutas
router.post('/purchases/:cid', finalizePurchase);



