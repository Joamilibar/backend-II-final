import Auth from "../middleware/auth.js";
import User from "../dao/models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import Utils from "../common/utils.js";
import paginate from 'mongoose-paginate-v2';
import productModel from "../dao/models/product.model.js";
import __dirname from "../common/utils.js";
// { authorization, createHash, auth isValidPassword,  passportCall, createToken, secretOrKey } 
import SessionsService from "../services/sessions.service.js";
import RegisterDTO from "../dto/register.dto.js";
import ProductDAO from "../dao/product.dao.js";
import dotenv from "dotenv";

const productDAO = new ProductDAO();
dotenv.config();

export default class ProductController {

    static getProducts = async (req, res) => {
        try {
            let { limit = 10, page = 1, sort, query, category, availability } = req.query;
            const productFilter = {};

            // Filtro por Query General
            if (query) {
                productFilter.$or = [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { code: { $regex: query, $options: "i" } }
                ];

            }

            // Filtro por Categoria

            if (category) {
                productFilter.category = new RegExp(category, 'i');
            }

            // Filtro por Disponibilidad

            if (availability) {
                productFilter.stock = availability === 'available' ? { $gt: 0 } : 0;
            }

            //Paginación y Ordenamiento

            const options = {
                limit: parseInt(limit, 10),
                page: parseInt(page, 1),
                sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
            }

            //const { limit = 10, page = 1, sot, query } = req.query;

            let result = await productModel.paginate(productFilter, options,); // Buscamos productos en la base de datos
            console.log(result);
            res.send({ result: "Success", payload: result })
        } catch (error) {
            res.send({ result: "Error", payload: error })
        }


        /* const products = await productDAO.getProducts();
        if (products) {
            res.status(200).send({ status: "success", products });
        } else {
            res.status(400).send({ status: "error", error: "No se pudieron obtener los productos" });
        } */
    }

    static createProduct = async (req, res) => {
        const product = req.body;
        const newProduct = await productDAO.createProduct(product);
        if (newProduct) {
            res.status(200).send({ status: "success", newProduct });
        } else {
            res.status(400).send({ status: "error", error: "No se pudo crear el producto" });
        }
    }

    static updateProduct = async (req, res) => {
        const { id } = req.params;
        const product = req.body;
        const updatedProduct = await productDAO.updateProduct(id, product);
        if (updatedProduct) {
            res.status(200).send({ status: "success", updatedProduct });
        } else {
            res.status(400).send({ status: "error", error: "No se pudo actualizar el producto" });
        }
    }

    static deleteProduct = async (req, res) => {
        const { id } = req.params;
        const deletedProduct = await productDAO.deleteProduct(id);
        if (deletedProduct) {
            res.status(200).send({ status: "success", deletedProduct });
        } else {
            res.status(400).send({ status: "error", error: "No se pudo eliminar el producto" });
        }
    }
}