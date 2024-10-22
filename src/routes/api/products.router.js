import { Router } from 'express';
import session from 'express-session';
import ProductModel from '../../dao/models/product.model.js';
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

router.get('/products/:id', ProductController.getProductById);


router.post('/products', Auth.accessRole, ProductController.createProduct);


router.put('/products/:id', Auth.accessRole, ProductController.updateProduct);

router.delete('/products/:id', Auth.accessRole, ProductController.deleteProduct);

// Ruta para que los usuarios puedan agregar productos a su carrito
//router.post('/carts/:cid/products/:pid', Auth.accessRole(['user']), cartController.addProductToCart);

export default router;