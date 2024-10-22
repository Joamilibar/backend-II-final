import Auth from "../middleware/auth.js";
import User from "../dao/models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import Utils from "../common/utils.js";
import paginate from 'mongoose-paginate-v2';
import ProductModel from "../dao/models/product.model.js";
import __dirname from "../common/utils.js";
// { authorization, createHash, auth isValidPassword,  passportCall, createToken, secretOrKey } 
import SessionsService from "../services/sessions.service.js";
import RegisterDTO from "../dto/register.dto.js";
import ProductDAO from "../dao/product.dao.js";
import dotenv from "dotenv";

const productDAO = new ProductDAO();
dotenv.config();

export default class ProductController {

    products
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

            let result = await productDAO.getProducts(productFilter, options,); // Buscamos productos en la base de datos
            console.log(result);
            res.send({ result: "Success", payload: result })
        } catch (error) {
            res.send({ result: "Error", payload: error })
        }

    }

    static getProductById = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productDAO.getProductById(id);
            if (!product) {
                return res.status(404).send({ result: "Error", error: "Producto no encontrado" });
            }
            res.send({ result: "Success", payload: product });
        } catch (error) {
            res.status(500).send({ result: "Error", payload: error.message });
        }
    }

    static createProduct = async (req, res) => {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
        // const products = await prodFileManager.readFile();

        // Validación de campos obligatorios

        if (!title || !description || !code || !price || !status || !stock || !category) {
            res.send({ status: "error", error: "Faltan Parámetros Obligatorios" });


        }
        try {
            const result = await ProductModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            });
            res.send({ result: "Successs", payload: result });
        } catch (error) {
            res.status(500).send({ result: "Error", payload: error.message });
        }

    }

    static updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedProduct = await productDAO.updateProduct(id, req.body);
            if (!updatedProduct) {
                return res.status(404).send({ result: "Error", error: "Producto no encontrado" });
            }
            //socketServer.emit('productUpdate', updatedProduct);
            res.send({ result: "Success", payload: updatedProduct });
        } catch (error) {
            res.status(500).send({ result: "Error", payload: error.message });
        }

    }

    static deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedProduct = await productDAO.deleteProduct(id);
            // const productId = parseInt(req.params.pid);

            //const updatedProducts = products.filter((product) => product.id !== productId);
            if (!deletedProduct) {
                return res.status(404).send({ result: "Error", error: "Producto no encontrado" });
            }
            res.send({ result: "Success", message: `Producto con el id ${pid} eliminado correctamente` });
        } catch (error) {
            res.status(500).send({ result: "Error", payload: error.message });
        }


        /* if (!updatedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            products.splice(updatedProducts - 1, 1);
            await productDAO.deleteProduct(updatedProducts);

            res.json({ message: `Producto con el id ${productId} eliminado correctamente` });

        } */
        // } catch(error) {
        res.status(404).json({ message: "Producto no encontrado" });
        // }

    }
}