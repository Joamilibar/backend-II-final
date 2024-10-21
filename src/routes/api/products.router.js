import { Router } from 'express';
import session from 'express-session';
import productModel from '../../dao/models/product.model.js';
import User from '../../dao/models/user.model.js';
import paginate from 'mongoose-paginate-v2';
import passport from 'passport';
import Auth from '../../middleware/auth.js';
import ProductController from '../../controllers/products.controller.js';
import Utils from '../../common/utils.js';
import __dirname from '../../common/utils.js';
import ProductDAO from '../../dao/product.dao.js';



const router = Router();

const productDAO = new ProductDAO();

// Rutas para productos
router.get('/products', ProductController.getProducts);


router.post('/products', async (req, res) => {


    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    // const products = await prodFileManager.readFile();

    // Validación de campos obligatorios

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.send({ status: "error", error: "Faltan Parámetros Obligatorios" });

        // res.status(400).json({ message: "Faltan campos obligatorios (thumbnails único campo no obligatorio)" });
    } // else {

    const result = await productModel.create({
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

});


router.put('/products/:id', async (req, res) => {
    const products = await productDAO.getProducts();
    const productId = parseInt(req.params.pid);
    const product = productDAO.getProductById(id);
    if (product) {

        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.status = status;
        product.stock = stock;
        product.category = category;
        product.thumbnails = thumbnails;
        await productDAO.updateProduct(products);

        // Emitir evento de actualización de producto
        //socketServer.emit('productUpdate', products);

        res.status(201).json(product);

    } else {
        res.status(404).json({ message: "Producto no actualizado" });
    }
});

router.delete('/products/:id', async (req, res) => {

    try {
        let products = await productDAO.getProductById();
        const productId = parseInt(req.params.pid);

        const updatedProducts = products.filter((product) => product.id !== productId);

        if (!updatedProducts) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            products.splice(updatedProducts - 1, 1);
            await productDAO.deleteProduct(updatedProducts);

            // Emitir elemento de eliminación de producto
            // socketServer.emit('productUpdate', products);


            res.json({ message: `Producto con el id ${productId} eliminado correctamente` });

        }
    } catch (error) {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

// Ruta para que los usuarios puedan agregar productos a su carrito
//router.post('/carts/:cid/products/:pid', Auth.accessRole(['user']), cartController.addProductToCart);

export default router;