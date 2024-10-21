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
            let user = await usersModel.findOne(id)
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
            //if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

            const user = await this.getUserById({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });
            console.log(user)

            let result = await usersModel.updateOne({ email }, { password: Utils.createHash(password) })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    /* currentUser = async (email) => {
        try {
            //const email = user.email;
            if (!email) throw new Error('No email provided');
            const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });

            //let decoded = jwt.verify(token, process.env.SECRET_KEY);

            //if (!user) throw new Error('User not found');

            //console.log('Decoded User: ', decoded)
            //return decoded // res.send(decoded.user);
            return user;

            /* if (!email) return res.status(400).send({ status: "error", error: "Valores incompletos" })

            const user = await usersModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, cartId: 1, role: 1 });
            return user */
    //} catch (error) {
    //console.error(error)
    //throw error;
    //console.log(error)
    // }
    //}; */

}