import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { dirname } from 'path'


dotenv.config()

export default class Utils {

    secretOrKey = process.env.SECRET_KEY;
    // Hashear la contraseña
    static createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    // Validar la contraseña
    static isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

    static passportCall = (strategy) => {
        return async (req, res, next) => {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) {
                    return next(err)
                }
                if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() });



                req.user = user;
                next();
            })(req, res, next)
        }
    }

    static authorization = (role) => {
        return async (req, res, next) => {
            if (!req.user) return res.status(401).send({ error: "Unauthorized" })
            if (req.user.role !== role) return res.status(403).send({ error: "No permission" })
            next()
        }
    }

    static createToken = (email) => {
        if (!email) {
            throw new Error('Email is required');
        };
        return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });


    }

    isValidEmail(email) { // Lo puedo pasar a utils ya que es una función que se puede reutilizar
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static __filename = fileURLToPath(import.meta.url);

    static __dirname = path.dirname(Utils.__filename);


}