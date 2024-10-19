import Auth from "../middleware/auth.js";
import usersModel from "./models/user.model.js";
import Utils from '../common/utils.js';
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class SessionDAO {
    getUsers = async () => {
        try {
            let users = await usersModel.find()
            return users
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserById = async (id) => {
        try {
            let user = await usersModel.findOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createUser = async (user) => {
        try {
            return usersModel.create(user)
        } catch (error) {
            console.log(error)
        }
    }

    updateUser = async (email, password) => { //(id, user)
        try {
            if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

            const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });
            console.log(user)

            if (!user) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });

            let result = await usersModel.updateOne({ email }, { password: Utils.createHash(password) })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    currentUser = async (user, token) => {
        try {
            const email = user.email;
            /* if (!user) {
                return res.send({ status: "error", error: "No authenticated user" });
            } */
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('Decoded User: ', decoded)
            return decoded // res.send(decoded.user);


            /* if (!email) return res.status(400).send({ status: "error", error: "Valores incompletos" })

            const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });
            return user */
        } catch (error) {
            console.error(error)
            //console.log(error)
        }
    };
}