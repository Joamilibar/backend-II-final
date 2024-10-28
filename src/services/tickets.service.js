import TicketModel from '../dao/models/ticket.model.js';
import CartModel from '../dao/models/cart.model.js';
import ProductModel from '../dao//models/product.model.js';
import CartDAO from '../dao/cart.dao.js';
import ProductDAO from '../dao/product.dao.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();


const cartDAO = new CartDAO();
const productDAO = new ProductDAO();

class TicketService {
    async sendTicketByEmail(cart, productsPurchased) {
        try {

            const email = cart.cart.email;

            if (!email) {
                console.error("Error: El email del carrito no está definido");
                throw new Error("El email del carrito no está definido");
            }
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }

            });


            let result = await transport.sendMail({
                from: 'joamilibarra@gmail.com',
                to: email,
                subject: 'Resumen de Compra',
                text: 'Gracias por su compra',
                html: `
                <h1>Su compra ha sido exitosa</h1>
                    <h2>Resumen de su compra</h2>
                    <p>Productos: 
                        <div>
                            <p>Aqui el detalle de su compra:
                        </div>
                    
        }</p >

            `
            })
            return result;


        } catch (error) {
            console.error("Error al intentar enviar ticket por memail:", error);
            throw new Error("Error al intentar enviar ticket por memail");
        }
    }
}

export default new TicketService();



