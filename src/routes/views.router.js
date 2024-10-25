import { Router } from 'express';
import jwt from 'jsonwebtoken';
//import ViewsController, { loginView, registerView, profileView, updateView, currentView, productView } from '../controllers/views.controller.js';
import Auth from '../middleware/auth.js';
import ProductModel from '../dao/models/product.model.js';
import CartModel from '../dao/models/cart.model.js';
import CartController from '../controllers/carts.controller.js';
import ViewsController from '../controllers/views.controller.js';
const router = Router();

router.get('/login', Auth.isNotAuthenticated, ViewsController.loginView);

router.get('/register', Auth.isNotAuthenticated, ViewsController.registerView);

router.get('/profile', Auth.isAuthenticated, ViewsController.profileView);

router.get('/update', Auth.isAuthenticated, Auth.isAdmin, ViewsController.updateView);

router.get('/current', Auth.isAuthenticated, ViewsController.profileView);

router.get('/currentView', Auth.isAuthenticated, ViewsController.currentView);

router.get('/products', Auth.isAuthenticated, Auth.isUser, ViewsController.productView);

router.get("/products/:pid", Auth.isAuthenticated, ViewsController.getProductById);

// GET /carts/cid - Mostrar carrito en vista Handlebars
router.get("/carts/:cid", ViewsController.getCartById); //** */

// PUT /carts/:cid/products/:pid - Actualizar producto(s) en carrito por id

router.put('/carts/:cid/products/:pid', ViewsController.cartProductUpdateView); //** */

export default router;

