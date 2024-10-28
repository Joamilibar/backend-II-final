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
import MailController from '../../controllers/mail.controller.js';


const router = express.Router();


router.post('/add-product', Auth.isAuthenticated, CartController.addProduct);


router.get("/carts", Auth.isAuthenticated, CartController.getCarts);


router.get("/carts/:cid", Auth.isAuthenticated, CartController.getCartById);


// PUT /api/carts/:cid - Actualizar carrito por id

router.put("/carts/:cid", Auth.isAuthenticated, CartController.updateProductInCart);

router.post("/carts/:cid/purchase", Auth.isAuthenticated, CartController.purchaseCart);

//router.post('/purchase/:cartId/:productId/:quantity', CartController.purchaseCart);


// PUT /api/carts/:cid/products/:pid - Actualizar producto(s) en carrito por id

router.put('/carts/:cid/products/:pid', Auth.isAuthenticated, CartController.updateProductInCart);


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