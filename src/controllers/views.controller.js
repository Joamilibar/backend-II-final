import User from '../dao/models/user.model.js';



export const loginView = async (req, res) => {
    res.render('login');

};

export const registerView = async (req, res) => {
    const roles = [
        { value: 'user', label: 'Usuario' },
        { value: 'admin', label: 'Administrador' }
    ];
    return res.render('register', { roles });
}


export const profileView = async (req, res) => {
    res.render('profile', { user: req.session.user });
}


export const updateView = async (req, res) => {
    res.render('update');

}


export const currentView = async (req, res) => {
    const user = req.session.user;
    console.log('Usuario Registrado: ', user);
    return res.render('current', { user });
}


