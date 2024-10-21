import Auth from "../middleware/auth.js";
import usersModel from "./models/user.model.js";
import Utils from '../common/utils.js';
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import productModel from "./models/product.model.js";




export default class ProductDAO {
    getProducts = async () => {
        try {
            let products = await productModel.find()
            return products
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (id) => {
        try {
            let product = await productModel.findOne({ _id: id })
            return product
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createProduct = async (product) => {
        try {
            return productModel.create(product)
        } catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (id, product) => {
        try {
            return productModel.updateOne({ _id: id }, product)
        } catch (error) {
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        try {
            return productModel.deleteOne({ _id: id })
        } catch (error) {
            console.log(error)
        }
    }
}