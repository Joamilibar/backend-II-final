import User from '../dao/models/user.model.js';
import ProductDAO from '../dao/product.dao.js';

const productDAO = new ProductDAO();

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

    if (user.role === 'admin') {
        return res.render('admin', { user });
    }
    if (user.role === 'user') {
        return res.render('current', { user });

    }
}

export const productView = async (req, res) => {
    try {
        //  Buscar productos en la base de datos
        const products = await productDAO.getProducts // productModel.find();
        // Renderizar la vista
        res.render('index', { title: 'Lista de Productos', products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
};
/*   
} */



