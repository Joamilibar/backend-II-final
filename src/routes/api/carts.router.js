import express from 'express';
import __dirname from "../../common/utils.js";
import ProductModel from '../../dao/models/product.model.js';
import CartModel from '../../dao/models/cart.model.js';
import CartController from '../../controllers/carts.controller.js';
import CartDAO from '../../dao/cart.dao.js';
import productDAO from '../../dao/product.dao.js';
import Auth from '../../middleware/auth.js';
import User from '../../dao/models/user.model.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Utils from '../../common/utils.js';


const router = express.Router();


router.post('/add-product', Auth.isAuthenticated, CartController.addProduct);
/* async (req, res) => {
const { productId } = req.body;
const userId = req.user._id; // Asegúrate de que el usuario esté autenticado

try {
    let cart = await CartDAO.getCartByUserId(userId); // Obtener el carrito del usuario (o crear uno si no existe)

    if (!cart) {
        cart = await CartDAO.createCart(userId); // Si no existe, creamos uno
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
        // Si el producto no está en el carrito, lo agregamos
        cart.products.push({ product: productId, quantity: 1 });
    } else {
        // Si ya existe, actualizamos la cantidad
        cart.products[productIndex].quantity += 1;
    }

    await cart.save(); // Guardar los cambios en la base de datos

    res.status(200).send({ status: 'success', payload: cart });
} catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send({ status: 'error', message: 'Error al agregar producto al carrito' });
}
}); */

router.get("/carts", CartController.getCarts);


router.get("/carts/:cid", CartController.getCartById);


// PUT /api/carts/:cid - Actualizar carrito por id

router.put("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartModel.findOne({ _id: cid });

        cart.products = products.map(product => ({
            product: product.product,
            quantity: product.quantity || 1 // Si no se proporciona la cantidad, se asume 1
        }));

        // Guardar los cambios en la base de datos
        let result = await cart.save();

        res.send({ status: "success", payload: result });


    } catch (error) {
        res.send({ status: "error", payload: "El carrito no existe" });
    }
});


// PUT /api/carts/:cid/products/:pid - Actualizar producto(s) en carrito por id

router.put('/carts/:cid/products/:pid', CartController.updateProductInCart);

/* async (req, res) => {

const { cid, pid } = req.params;
const { quantity } = req.body;
console.log("Cantidad: ", quantity);

try {

    let cart = await CartModel.findOne({ _id: cid }); //.populate("carts.cart");
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
        // return res.send({ status: "error", payload: "El producto no está en el carrito" });
        cart.products.push({ product: pid, quantity: quantity });

    }

    cart.products[productIndex].quantity = quantity;

    // Actualizar cambios en base de datos
    let result = await CartModel.updateOne({ _id: cid }, { products: cart.products });

    res.send({ status: "success", payload: result });

}

catch (error) {
    return res.send({ status: "error", payload: "El producto no existe" });
} 

});*/

// Crear carrito en Mongo

router.post("/carts", CartController.createCart);

// DELETE /api/carts/:cid/products/:pid - Eliminar producto de carrito por id

router.delete("/carts/:cid/products/:pid", async (req, res) => {

    const { cid, pid } = req.params;

    try {

        const cart = await CartModel.findOne({ _id: cid });
        console.log("Carrito Encontrado");
        const cartProduct = await cart.products.findIndex(item => item.product.toString() === pid);
        console.log(cartProduct)



        const cartUpdated = await cart.products.splice(cartProduct, 1);
        console.log("Producto Eliminado del Carrito = ", cartUpdated);
        let result = await CartModel.updateOne({ _id: cid }, { products: cart.products });
        res.send({ status: "success", message: "Producto Eliminado", payload: result });



    } catch (error) {
        res.send({ status: "error", payload: "El producto no existe" });
    }
}
);


// DELETE /api/carts/:cid - Eliminar todos los productos del carrito (id)

router.delete("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        let cart = await CartModel.findOne({ _id: cid });

        if (cart.products.length === 0) {
            return res.send({ status: "error", payload: "El carrito no tiene productos" });
        }

        cart.products = [];
        let result = await CartModel.updateOne({ _id: cid }, { products: cart.products });
        res.send({ status: "success", payload: result, message: "Carrito vaciado" });
    }
    catch (error) {
        res.send({ status: "error", payload: "El carrito no existe" });
    }

});

export default router;