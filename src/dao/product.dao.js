import Auth from "../middleware/auth.js";
import usersModel from "./models/user.model.js";
import Utils from '../common/utils.js';
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ProductModel from "./models/product.model.js";




export default class ProductDAO {

    getProducts = async (filter, options) => {
        try {
            let products = await ProductModel.paginate(filter, options)
            return products
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (id) => {
        try {
            let products = await ProductModel.findById({ _id: id })
            return products
        } catch (error) {
            console.error("Error en getProductById:", error);
            return null
        }
    }

    createProduct = async (productData) => {
        try {
            const newProduct = await ProductModel.create(productData);
            return newProduct;
        } catch (error) {
            console.error("Error en createProduct:", error);
            return null;
        }
    }

    updateProduct = async (id, productData) => {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
            return updatedProduct;
        } catch (error) {
            console.error("Error en updateProduct:", error);
            return null;
        }
    }

    deleteProduct = async (id) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.error("Error en deleteProduct:", error);
            return null;
        }
    }
};