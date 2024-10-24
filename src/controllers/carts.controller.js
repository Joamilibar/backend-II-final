import User from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import paginate from 'mongoose-paginate-v2';
import ProductModel from "../dao/models/product.model.js";
import CartModel from "../dao/models/cart.model.js";
import __dirname from "../common/utils.js";
import SessionsService from "../services/sessions.service.js";
import RegisterDTO from "../dto/register.dto.js";
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
    static getCarts = async (req, res) => {
        try {

            const filter = {};
            const options = {
                limit: req.query.limit || 10,
                page: req.query.page || 1
            };

            // Llamada al método getCarts del DAO
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
            // Extraemos el email del cuerpo de la solicitud, ya que será la clave para asociar el carrito al usuario
            const { email } = req.body;

            // Validamos que el email esté presente
            if (!email) {
                return res.status(400).send({ status: "error", message: "El email es requerido para crear un carrito" });
            }

            // Creamos el carrito vacío, asociado al usuario por el email
            const newCart = {
                email: email,  // Asumimos que el email es único y suficiente para identificar al usuario
                products: [],  // Inicialmente vacío
                timestamp: new Date()
            };

            // Utilizamos el DAO para guardar el nuevo carrito en la base de datos
            const result = await cartDAO.createCart(newCart);

            // Si la creación es exitosa, devolvemos una respuesta con el nuevo carrito
            res.status(201).send({ status: "success", payload: result });
        } catch (error) {
            console.error('Error creando el carrito:', error);
            // En caso de error, devolvemos un estado 500 con el mensaje de error
            res.status(500).send({ status: "error", message: error.message });
        }

        /* try {

            console.log('Req.Body: ', req.body);
            const { first_name, last_name, email, products } = req.body;
            //const { products } = req.body;
            console.log(email);
            //const newCart = await cartDAO.createCart({ products });


            let result = await cartDAO.createCart({
                first_name: first_name,
                last_name: last_name,
                email: email,
                products: [

                ]
                ,
                timestamp: new Date()
            });

            res.status(201).send({ status: "success", payload: result });

        } catch (error) {
            res.status(500).send({ result: "Error", payload: error.message });

        }
 */
    }

    static async getUserCartId(req, res) {
        const cartId = req.user.cart;
        console.log(cartId);

    }

    static updateProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params; // ID del carrito y del producto
            let { quantity } = req.body; // Cantidad de producto a actualizar

            // Verificar que quantity sea un número válido
            if (!quantity || isNaN(quantity)) {
                return res.status(400).send({ status: "error", message: "Cantidad inválida" });
            }

            // Asegúrate de que quantity sea positivo
            if (quantity <= 0) {
                return res.status(400).send({ status: "error", message: "La cantidad debe ser mayor que 0" });
            }

            // Llama a la función del DAO para actualizar el carrito
            const updatedCart = await cartDAO.addProductToCart(cid, pid, quantity = 1);

            res.status(200).send({ status: "success", payload: updatedCart });
        } catch (error) {
            console.error('Error al actualizar el producto en el carrito:', error);
            res.status(500).send({ status: "error", message: error.message });
        }

    };

    /* static async updateProductInCart(req, res) {
        try {
            const { cid } = req.params; // ID del carrito
            const { productId, quantity } = req.body; // Asegúrate de que estos campos vengan en la solicitud

            // Llamada a la función del DAO
            const updatedCart = await cartDAO.addProductToCart(cid, { productId, quantity });

            res.status(200).send({ status: "success", payload: updatedCart });
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message });
        }
    }
 */



    /* const { cid, pid } = req.params;
    const { productId, quantity } = req.body;

    try {
        // Buscar el carrito
        let cart = await cartDAO.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ status: "error", payload: "El carrito no existe" });
        }

        // Buscar el producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);

        // Si el producto no existe en el carrito, agregarlo
        if (productIndex === -1) {
            cart = await cartDAO.addProductToCart(cid, { product: pid, quantity: quantity + 1 });
        } else {
            // Si el producto existe, actualiza la cantidad
            cart.products[productIndex].quantity += quantity;

            // Guardar los cambios en la base de datos
            await cartDAO.updateCartProduct(cid, cart.products);
        }

        res.send({ status: "success", payload: cart });

    } catch (error) {
        console.error("Error al actualizar el producto en el carrito:", error);
        res.status(500).send({ status: "error", payload: "Error al actualizar el producto en el carrito" });
    } */


};