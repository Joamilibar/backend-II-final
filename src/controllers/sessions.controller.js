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
            email,
            password,
            first_name,
            last_name,
            age,
            role
        } = req.body;


        /* const registerDTO = new RegisterDTO();
        const response = await SessionsService.register(registerDTO);
        console.log(response)
        const { token } = response; // destructuring */
        const token = Utils.createToken(email);
        console.log(({ status: "success", message: "Usuario registrado correctamente" }))
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 30 * 1000 });
        res.redirect('/login');



    }

    static failRegister = async (req, res) => {
        console.log('Estrategia Fallida')
        res.status(400).send({ status: "error", error: "Usuario ya existe" })
    };


    static login = async (req, res) => {
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
        res.redirect('/profile');

        /*  if (req.user.role === 'admin') {
    return res.redirect('/admin');
    
    } */

        /*  console.log("Login Error", error)
         res.status(400).send({ status: "error", error: "Error User Login" }) */

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
        let result = await sessionDAO.updateUser(email, password);
        console.log('Usuario actualizado: ', result)
        res.redirect('/login');
    };


    static current = async (req, res) => {
        const token = req.cookies.token;
        const user = req.user;
        console.log('Usuario autenticado: ', user)

        const result = await sessionDAO.currentUser(user, token);
        res.send({ status: "success", message: "There is an authenticated user" })
        /*
         try {
             let decoded = jwt.verify(token, process.env.SECRET_KEY);
             console.log('Decoded User: ', decoded)
             return res.send(decoded.user);
         } catch (error) {
             console.error(error)
         } */
    }

}
/* export const register = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let token = createToken(req.user);
        
        console.log(({ status: "success", message: "Usuario registrado correctamente" }))
        
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 30 * 1000 });
        res.redirect('/login');
        } catch (error) {
            console.log("Register Error", error)
            res.status(400).send({ status: "error", error: "Error User Register" })
            }
            }; */

