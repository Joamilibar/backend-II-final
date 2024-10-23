import passport from 'passport';
import Utils from '../common/utils.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

export default class Auth {

    static isAuthenticated = (req, res, next) => {
        if (req.session.user) {
            return next();
        } else {
            res.redirect('/login');
        }
    };

    static isNotAuthenticated = (req, res, next) => {
        if (!req.session.user) {
            return next();
        } else {
            res.redirect('/profile');
        }
    };


    static authToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ error: 'No authenticated' });
        }
        const token = authHeader.split(' ')[1];
        console.log("Este es el token: ", token)

        jwt.verify(token, Utils.secretOrKey, (error, credencials) => {

            if (error) {
                return res.status(403).send({ error: 'Invalid Token' });
            }

            req.user = credencials;
            console.log('Credenciales: ', req.user)
            next();
        })
    };

    static verifyToken = (token, next) => {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded);
            return decoded;
        } catch (error) {
            console.error("Error al verificar el token:", error);
            //throw new Error("Token inválido o expirado");
        }
    };

    static isAdmin = (req, res, next) => {
        const user = req.user || req.session.user; // Dependiendo de cómo manejes la autenticación
        if (user && user.role === 'admin') {
            return next();
        }
        return res.status(403).send({ status: 'error', message: 'Acceso denegado. Sólo administradores pueden realizar esta acción.' });
    }

    // Middleware para verificar si el usuario tiene rol de usuario
    static isUser = (req, res, next) => {
        const user = req.user || req.session.user; // Dependiendo de cómo manejes la autenticación
        if (user && user.role === 'user') {
            return next();
        }
        return res.status(403).send({ status: 'error', message: 'Acceso denegado. Sólo los usuarios pueden agregar productos al carrito.' });
    }


    static accessRole = (roles) => {
        return (req, res, next) => {
            const userRole = req.user?.role;

            if (roles.includes(userRole)) {
                return next();
            }
            return res.status(403).send({ status: "error", message: "Acceso denegado" }).next();



            /* const token = req.cookies.token;

            if (!token) {
                return res.status(401).send({ error: 'No authenticated' });
            }

            const decoded = Auth.verifyToken(token);
            if (!decoded || !roles.includes(decoded.user.role)) {
                return res.status(403).send({ error: 'Unauthorized access' });
            }

            next(); */ // Si el rol es válido, continúa
        };

    }
};
