import Auth from "../middleware/auth.js";
import User from "../dao/models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import Utils from "../common/utils.js";
// { authorization, createHash, auth isValidPassword,  passportCall, createToken, secretOrKey } 
import SessionsService from "../services/sessions.service.js";
import RegisterDTO from "../dto/register.dto.js";
import SessionDAO from "../dao/session.dao.js";
import dotenv from "dotenv";

const sessionDAO = new SessionDAO();
dotenv.config();

export default class SessionsController {
    static register = async (req, res) => {
        const {
            first_name,
            last_name,
            email,
            age,
            password,
            cartId,
            role
        } = req.body;

        const token = Utils.createToken(email);
        console.log(({ status: "success", message: "Usuario registrado correctamente" }))
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 30 * 1000 });
        res.redirect('/login');
    }

    static failRegister = async (req, res) => {
        console.log('Estrategia Fallida')
        res.status(400).send({ status: "error", error: "Usuario ya existe" })
    };


    static login = async (req, res, next) => {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales Invalidas" })

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cartId: req.user.cartId,
            role: req.user.role
        };

        let token = Utils.createToken(req.user);
        console.log(token)
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 30 * 1000 });
        next();
        //res.redirect('/profile');

        /*  if (req.user.role === 'admin') {
    return res.redirect('/admin');
    
    } */


    };


    static failLogin = async (req, res) => {
        console.log('Login Fallida')
        res.status(400).send({ status: "error", error: "Credenciales Invalidas" })
    };


    static logout = async (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error al cerrar sesión');
            res.redirect('/login');
        });
    };

    static update = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

        let result = await sessionDAO.updateUser(email, password);
        console.log('Usuario actualizado: ', result)

        if (!result) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });

        res.redirect('/login');
    };


    static roleAccess = async (req, res) => {
        try {
            let token = req.cookies.token;
            const user = req.user || req.session.user;
            if (!token) {
                return res.send({ status: "error", error: "No authenticated user" })
            }

            if (user.role === 'admin') {
                return res.redirect('/api/cart')
            }
            if (user.role === 'user') {
                return res.redirect('/products')
            }

        } catch (error) {
            return res.status(403).send({ status: 'error', message: 'Acces denied. Only users with allowed roles' });
            // return res.status(500).send({ status: "error", error: "Error al obtener el usuario" })
        }


        /* const decoded = Auth.verifyToken(token);
        //console.log('Decoded User: ', decoded)
        return res.send(decoded);
    */

    }
};

