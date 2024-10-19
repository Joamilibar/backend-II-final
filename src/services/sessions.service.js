import UserDAO from "../dao/user.dao.js"
import Utils from "../common/utils.js"



export default class SessionsService {
    static register = async (sessionDTO) => {

        try {
            const userDAO = new UserDAO();
            const user = await userDAO.createUser(sessionDTO);

            let token = Utils.createToken(user?.email);

            console.log(({ status: "success", message: "Usuario registrado correctamente" }))
            return { token, user }

        } catch (error) {
            throw new Error(error)
        }

    }
}