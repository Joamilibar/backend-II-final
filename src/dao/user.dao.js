import usersModel from "./models/user.model.js";

export default class UserDAO {
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

    updateUser = async (id, user) => {
        try {
            let result = await usersModel.updateOne({ _id: id }, { $set: user })
            return result
        } catch (error) {
            console.log(error)
        }
    }
}