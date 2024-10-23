addProduct = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;  // Obtener el ID del usuario autenticado

    try {
        // Verificar que el producto exista
        const product = await ProductDAO.getProductById(productId);
        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }

        // Obtener el carrito del usuario o crear uno si no existe
        let cart = await CartDAO.getCartByUserId(userId);

        if (!cart) {
            // Crear un carrito si el usuario no tiene uno asignado
            cart = await CartDAO.createCart(userId);
        }

        // Buscar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            // Si el producto no está en el carrito, lo agregamos
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            // Si ya existe, actualizamos la cantidad
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();  // Guardar los cambios en la base de datos
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send({ status: 'error', message: 'Error al agregar producto al carrito' });
    }
};