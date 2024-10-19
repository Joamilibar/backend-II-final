import passport from 'passport';
import Utils from '../common/utils.js';
import jwt from 'jsonwebtoken';

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

    /* export const isAdmin = (req, res, next) => {
        if (req.session.user.role === 'admin') {
            return next();
        } else {
            res.redirect('/profile');
        }
    }; */


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


    /* export const authorizeRole = (roles) => {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).send({ error: 'Unauthorized' });
                }
                next();
                }
                } */

}

