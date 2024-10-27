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

}

    static purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params; // ID del carrito
        const cart = await cartDAO.getCartById(cid); // Obtener carrito por ID

        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productsNotPurchased = [];
        const productsPurchased = [];

        // Iterar sobre los productos del carrito
        for (const item of cart.products) {
            const product = await productDAO.getProductById(item.product);

            if (!product) {
                productsNotPurchased.push({ ...item, reason: 'Producto no encontrado' });
                continue;
            }
            console.log(product.stock)
            if (product.stock >= item.quantity) {
                // Si hay suficiente stock, restar la cantidad comprada del stock
                product.stock -= item.quantity;
                await productDAO.updateProductStock(product._id, product.stock); // Asegúrate de usar el ID correcto
                productsPurchased.push(item); // Agregar a los productos comprados
            } else {
                // Si no hay suficiente stock, agregar a la lista de no comprados
                productsNotPurchased.push({
                    ...item,
                    reason: `Stock insuficiente. Stock disponible: ${product.stock}`,
                });
            }
        }

        // Filtrar los productos que no fueron comprados y actualizar el carrito
        const remainingProducts = cart.products.filter(
            item => !productsPurchased.some(purchased => purchased.product.equals(item.product))
        );

        await cartDAO.updateCart(cid, remainingProducts); // Actualiza el carrito con los productos restantes

        // Responder con el resumen de la compra
        res.status(200).send({
            status: 'success',
            message: 'Compra finalizada',
            purchased: productsPurchased,
            notPurchased: productsNotPurchased,
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
};

{
    {
        ! async function addToCart(productId) {
            try {
                const response = await
                    fetch(`/api/carts/add-product`, {
                        method: 'POST', headers: {
                            'Content-Type':
                                'application/json',
                        }, body: JSON.stringify({ productId }),
                    }); const result
                        = await response.json(); if (result.status === 'success') {
                            alert('Producto
    agregado al carrito correctamente'); } else { alert('Error al agregar el
    producto al carrito'); } } catch (error) { console.error('Error al agregar
    el producto: ', error); alert('Error al agregar el producto al carrito'); } }}

{{! function addToCart(productId) { // Lógica para agregar el producto al
    carrito console.log(`Producto ${productId} agregado al carrito`);
                            } }
            }

