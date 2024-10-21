import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { loginView, registerView, profileView, updateView, currentView, productView } from '../controllers/views.controller.js';
import Auth from '../middleware/auth.js';
const router = Router();

router.get('/login', Auth.isNotAuthenticated, loginView);

router.get('/register', Auth.isNotAuthenticated, registerView);

router.get('/profile', Auth.isAuthenticated, profileView);

router.get('/update', Auth.isNotAuthenticated, updateView);

router.get('/current', Auth.isAuthenticated, currentView);

router.get('/products', Auth.isAuthenticated, productView);

router.get("/products/:pid", async (req, res) => {
    try {
        // Obtener el id del producto
        const { pid } = req.params;
        const product = await productModel.findOne({ _id: pid }); // Buscar producto en la base de datos

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('product', { title: 'Detalle del Producto', product: product }); // Renderizar la vista
    } catch (error) {
        res.send({ status: "error", payload: "El producto no existe" });
    }
});

// GET /carts/cid - Mostrar carrito en vista Handlebars

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        // Buscar el carrito
        const cart = await cartModel.findOne({ _id: cid }).populate("products.product");
        // Renderizar la vista
        res.render('cart', { title: 'Carrito de Compra', cart: cart });
    }
    catch (error) {
        res.send({ status: "error", payload: "El carrito no existe" });
    }
});


// PUT /carts/:cid/products/:pid - Actualizar producto(s) en carrito por id

router.put('/carts/:cid/products/:pid', async (req, res) => {

    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log("Cantidad: ", quantity);

    try {
        // Buscar el carrito
        let cart = await cartModel.findOne({ _id: cid }); //.populate("carts.cart");
        console.log("Carrito Encontrado: ");
        //console.log(cart.products);


        if (!cart) {

            return res.send({ status: "error", payload: "El carrito no existe" });
        }

        // Buscar el producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);
        console.log("Indice Producto en carrito: ", productIndex)


        //Verifico si el producto ya existe en el carrito
        if (productIndex === -1) {
            // Agregar producto al carrito
            cart = await cartModel.findOneAndUpdate({ _id: cid }, { $push: { products: { product: pid, quantity: quantity } } }, { new: true });

        }

        // Actualizar cantidad del producto

        cart.products[productIndex].quantity += quantity;

        // Actualizar cambios en base de datos
        let result = await cartModel.updateOne({ _id: cid }, { products: cart.products });

        res.send({ status: "success", payload: result });

    }

    catch (error) {
        return res.send({ status: "error", payload: "El producto no existe" });
    }

});

//router.get('/products', Auth.isAuthenticated, productView);

/* async (req, res) => {
try {
    //  Buscar productos en la base de datos
    const products = await productModel.find();
    // Renderizar la vista
    res.render('index', { title: 'Lista de Productos', products });
} catch (error) {
    res.status(500).send('Error al obtener los productos');
} */


export default router;

