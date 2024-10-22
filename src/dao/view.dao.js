import CartModel from "./models/cart.model.js";
import ProductModel from "./models/product.model.js";
import __dirname from "../common/utils.js";



export default class ViewtDAO {

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

    createCart = async (cart) => {
        try {
            const newCart = await CartModel.create(cart);
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

    getProducts = async (filter, options) => {
        try {
            let products = await ProductModel.find(filter, options)
            return products
        } catch (error) {
            console.log(error)
            return null
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            let cart = await CartModel.findById({ _id: cid });
            let product = await ProductModel.findById({ _id: pid });
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
}


