import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'


export const secretOrKey = 'userSecretToken';

// Hashear la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validar la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const passportCall = (strategy) => {
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



export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.role !== role) return res.status(403).send({ error: "No permission" })
        next()
    }
}

export const createToken = (user) => {
    const token = jwt.sign({ user }, secretOrKey, { expiresIn: '1h' })
    return token;

}