import { Router } from 'express';
import User from '../../dao/models/user.model.js';
//import { authorization, createHash, isValidPassword, passportCall, createToken } from '../../utils.js';
import passport from 'passport';
import Auth from '../../middleware/auth.js';
import SessionsController from '../../controllers/sessions.controller.js';
import Utils from '../../common/utils.js';



const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), SessionsController.register);

router.get('/failregister', SessionsController.failRegister);

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), SessionsController.login);

router.get('/faillogin', SessionsController.failLogin);

router.post('/logout', Auth.isAuthenticated, SessionsController.logout);

router.post('/update', SessionsController.update);

router.get('/current', Auth.isAuthenticated, Utils.passportCall('jwt'), SessionsController.current);
export default router;
