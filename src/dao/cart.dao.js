import CartModel from "../dao/models/cart.model.js";
import ProductModel from "../dao/models/product.model.js";
import __dirname from "../common/utils.js";



export default class CartDAO {

    getCarts = async (filter, options) => {
        try {
            let carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getCartById = async (id) => {
        try {
            let cart = await CartModel.findById(id).populate("products.product");
            return cart
        } catch (error) {
            console.error("Error en getCartById:", error);
            return null
        }
    }

    createCart = async (user) => {
        try {
            console.log("Creando carrito para el usuario:", user);
            const newCart = await CartModel.create({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                products: [],
                timestamp: new Date()
            });

            return newCart;
        } catch (error) {
            console.error("Error en createCart:", error);
            return null;
        }
    }

    updateCart = async (id, cartData) => {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(id, cartData, { new: true });
            return updatedCart;
        } catch (error) {
            console.error("Error en updateCart:", error);
            return null;
        }
    }

    deleteCart = async (id) => {
        try {
            const deletedCart = await CartModel.findByIdAndDelete(id);
            return deletedCart;
        } catch (error) {
            console.error("Error en deleteCart:", error);
            return null;
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            let cart = await CartModel.findById(cid);
            let product = await ProductModel.findById(pid);
            cart.products.push(product);
            cart.save();
            return cart;
        } catch (error) {
            console.error("Error en addProductToCart:", error);
            return null;
        }
    }

    removeProductFromCart = async (cid, pid) => {
        try {
            let cart = await CartModel.findById({ _id: cid });
            let product = await ProductModel.findById({ _id: pid });
            cart.products.pull(product);
            cart.save();
            return cart;
        } catch (error) {
            console.error("Error en removeProductFromCart:", error);
            return null;
        }
    }

    updateCartProduct = async (cid, pid, quantity) => {
        try {
            return await CartModel.updateOne({ _id: cartId }, { products });
        } catch (error) {
            console.error("Error al actualizar los productos en el carrito:", error);
            return null;
        }
    }
}

