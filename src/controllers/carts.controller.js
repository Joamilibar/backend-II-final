import User from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import paginate from 'mongoose-paginate-v2';
import ProductModel from "../dao/models/product.model.js";
import CartModel from "../dao/models/cart.model.js";
import __dirname from "../common/utils.js";
import SessionsService from "../services/sessions.service.js";
import ProductDAO from "../dao/product.dao.js";
import CartDAO from "../dao/cart.dao.js";
import dotenv from "dotenv";
import passport from 'passport';
import Auth from '../middleware/auth.js';
import SessionsController from '../controllers/sessions.controller.js';
import Utils from '../common/utils.js';

const productDAO = new ProductDAO();
const cartDAO = new CartDAO();
dotenv.config();

export default class CartController {

    static addProduct = async (req, res) => {
        const { productId } = req.body;
        const userId = req.user._id;  // Obtener el ID del usuario autenticado
        console.log(productId)
        console.log(userId)
        try {

            const product = await ProductDAO.getProductById(productId);
            if (!product) {
                return res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
            }


            let cart = await CartDAO.getCartByUserId(userId);

            if (!cart) {

                cart = await CartDAO.createCart(userId);
            }


            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {

                cart.products.push({ product: productId, quantity: 1 });
            } else {

                cart.products[productIndex].quantity += 1;
            }

            await cart.save();
            res.status(200).send({ status: 'success', payload: cart });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).send({ status: 'error', message: 'Error al agregar producto al carrito' });
        }
    }
    static getCarts = async (req, res) => {
        try {

            const filter = {};
            const options = {
                limit: req.query.limit || 10,
                page: req.query.page || 1
            };

            const carts = await cartDAO.getCarts(filter, options);

            if (carts) {
                return res.status(200).json(carts);
            } else {
                return res.status(404).json({ message: 'No se encontraron carritos' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener los carritos', error });
        }

    }

    static getCartById = async (req, res) => {

        const { cid } = req.params;
        try {
            console.log(cid);
            let cart = await cartDAO.getCartById(cid);
            console.log(cart);
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no existe' });
            }
            return res.send({ status: "success", payload: cart });
        } catch (error) {
            res.send({ status: "error", payload: "El carrito no existe" });
        }

    }


    static createCart = async (req, res) => {

        try {

            const { email } = req.body;
            console.log(email)

            if (!email) {
                return res.status(400).send({ status: "error", message: "El email es requerido para crear un carrito" });
            }


            const newCart = {
                email: email,
                products: [],
                timestamp: new Date()
            };


            const result = await cartDAO.createCart(newCart);


            res.status(201).send({ status: "success", payload: result });
        } catch (error) {
            console.error('Error creando el carrito:', error);

            res.status(500).send({ status: "error", message: error.message });
        }


    }

    static async getUserCartId(req, res) {
        const cartId = req.user.cart;
        console.log(cartId);

    }

    static updateProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            let { quantity } = req.body;
            console.log('Cantidad', quantity)
            console.log('Producto', pid)
            console.log('Carrito', cid)



            if (!quantity || isNaN(quantity)) {
                return res.status(400).send({ status: "error", message: "Cantidad inválida" });
            }


            if (quantity <= 0) {
                return res.status(400).send({ status: "error", message: "La cantidad debe ser mayor que 0" });
            }


            const updatedCart = await cartDAO.addProductToCart(cid, pid, quantity = 1);

            res.status(200).send({ status: "success", payload: updatedCart });
        } catch (error) {
            console.error('Error al actualizar el producto en el carrito:', error);
            res.status(500).send({ status: "error", message: error.message });
        }

    }

    static purchaseCart = async (req, res) => {

        try {
            const { cid } = req.params;
            const cart = await cartDAO.getCartById(cid);

            if (!cart) {
                return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
            }

            const productsNotPurchased = [];
            const productsPurchased = [];


            for (const item of cart.products) {
                const product = await productDAO.getProductById(item.product);

                if (!product) {
                    productsNotPurchased.push({ ...item, reason: 'Producto no encontrado' });
                    continue;
                }
                console.log('Estock por productos', product.stock)
                if (product.stock >= item.quantity) {

                    product.stock -= item.quantity;
                    await productDAO.updateProductStock(product._id, product.stock);
                    productsPurchased.push(item);
                } else {

                    productsNotPurchased.push({
                        ...item,
                        reason: `Stock insuficiente. Stock disponible: ${product.stock}`,
                    });
                }
            }

            const remainingProducts = cart.products.filter(
                item => !productsPurchased.some(purchased => purchased.product.equals(item.product))
            );
            console.log("REMAINING", remainingProducts)
            console.log("PRODUCTS PURCHASED", productsPurchased)

            await cartDAO.updateCart(cid, remainingProducts);

            //await cartDAO.deleteCart(cid);
            // Responder con el resumen de la compra
            res.status(200).send({
                status: 'success',
                message: 'Compra finalizada',
                purchased: productsPurchased,
                notPurchased: productsNotPurchased
            });
        } catch (error) {
            console.error('Error al procesar la compra (purchaseCart):', error);
            res.status(500).send({ status: 'error', message: error.message });
        }


    }

}
