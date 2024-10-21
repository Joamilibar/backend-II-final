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
            return decoded;
        } catch (error) {
            console.error("Error al verificar el token:", error);
            //throw new Error("Token inválido o expirado");
        }
    };

    static accessRole = (user) => {
        return (req, res, next) => {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).send({ error: 'No authenticated' });
            }

            const decoded = Auth.verifyToken(token);
            if (!decoded || !roles.includes(decoded.user.role)) {
                return res.status(403).send({ error: 'Unauthorized access' });
            }

            next(); // Si el rol es válido, continúa
        };

    }
};
