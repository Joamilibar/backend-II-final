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


    static current = async (req, res, next) => {
        let token = req.cookies.token;
        if (!token) {
            return res.send({ status: "error", error: "No authenticated user" })
        }
        try {
            let decoded = Auth.verifyToken(token);
            const userData = {
                id: decoded.email._id,
                first_name: decoded.email.first_name,
                last_name: decoded.email.last_name,
                email: decoded.email.email,
                age: decoded.email.age,
                cartId: decoded.email.cartId,
                role: decoded.email.role
            };
            /*   if (decoded.role === 'admin') {
                  return res.redirect('cart')
              }
              if (decoded.role === 'user') {
                  return res.render('product')
              }; */
            console.log('Decoded User: ', userData)
            return res.status(200).send(userData);


        } catch (error) {
            console.error(error)
        }

    }
};

