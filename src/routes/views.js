import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { loginView, registerView, profileView, updateView, currentView } from '../controllers/views.controller.js';
import Auth from '../middleware/auth.js';
const router = Router();

router.get('/login', Auth.isNotAuthenticated, loginView);

router.get('/register', Auth.isNotAuthenticated, registerView);

router.get('/profile', Auth.isAuthenticated, profileView);

router.get('/update', Auth.isNotAuthenticated, updateView);

router.get('/current', Auth.isAuthenticated, currentView);

export default router;

