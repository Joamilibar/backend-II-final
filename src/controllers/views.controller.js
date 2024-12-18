import User from '../dao/models/user.model.js';
import ProductDAO from '../dao/product.dao.js';
import CartDAO from '../dao/cart.dao.js';
import ViewDAO from '../dao/view.dao.js';
import CartController from './carts.controller.js';
import ProductModel from '../dao/models/product.model.js';


const productDAO = new ProductDAO();
const cartDAO = new CartDAO();
const viewDAO = new ViewDAO();

export default class ViewsController {

    static loginView = async (req, res) => {

        res.render('login');

    };

    static registerView = async (req, res) => {
        const roles = [
            { value: 'user', label: 'Usuario' },
            { value: 'admin', label: 'Administrador' }
        ];
        return res.render('register', { roles });
    }


    static profileView = async (req, res) => {
        res.render('profile', { user: req.session.user });
    }


    static updateView = async (req, res) => {
        res.render('update');

    }


    static currentView = async (req, res) => {
        try {
            const user = req.session.user;
            console.log('Usuario Registrado: ', user);

            if (user.role === 'admin') {
                res.redirect('/products')
            }
            if (user.role === 'user') {
                res.redirect('/products')
            };
        } catch (error) {
            res.send({ status: "error", payload: "You need to login" });

        }
    }

    static productView = async (req, res) => {
        try {
            const products = await viewDAO.getProducts();
            res.render('index', { title: 'Lista de Productos', products });
        } catch (error) {
            res.status(500).send('Error al obtener los productos');
        }
    };

    static adminView = async (req, res) => {
        try {
            const products = await viewDAO.getProducts();
            res.render('realTimeProducts', { title: 'Lista de Productos', products });
        } catch (error) {
            res.status(500).send('Error al obtener los productos (adminView Controller)');
        }
    }

    static getProductById = async (req, res) => {
        try {
            // Obtener el id del producto
            const { pid } = req.params;
            const product = await productDAO.getProductById(pid); // Buscar producto en la base de datos

            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            res.render('product', { title: 'Detalle del Producto', product: product }); // Renderizar la vista
        } catch (error) {
            res.send({ status: "error", payload: "El producto no existe" });
        }
    }


    static getCartById = async (req, res) => {
        const { cid } = req.params;

        try {

            const cart = await viewDAO.getCartById(cid);

            res.render('cart', { title: 'Carrito de Compra', cart: cart });
        }
        catch (error) {
            res.send({ status: "error", payload: "El carrito no existe" });
        }
    }

    static cartProductUpdateView = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;
        console.log("Cantidad: ", quantity);

        try {
            // Buscar el carrito
            let cart = await viewDAO.getCartById(cid); //.populate("carts.cart");
            console.log("Carrito Encontrado: ");
            //console.log(cart.products);


            if (!cart) {
                cart = new cartDAO.createCart({ user: userId, products: [] })
                //return res.send({ status: "error", payload: "El carrito no existe" });
            }

            // Buscar el producto en el carrito
            const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);
            console.log("Indice Producto en carrito: ", productIndex)


            //Verifico si el producto ya existe en el carrito
            if (productIndex === -1) {
                // Agregar producto al carrito
                cart = await cartDAO.addProductToCart({ _id: cid }, { $push: { products: { product: pid, quantity: quantity } } }, { new: true });

            }

            // Actualizar cantidad del producto

            cart.products[productIndex].quantity += quantity;

            // Actualizar cambios en base de datos
            let result = await CartModel.updateOne({ _id: cid }, { products: cart.products });

            res.send({ status: "success", payload: result });

        }

        catch (error) {
            return res.send({ status: "error", payload: "El producto no existe" });
        }
    }


}






