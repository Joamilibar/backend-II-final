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

    async createAndSendTicket(productsPurchased, userId, cart, email, totalAmount) {


        try {

            if (!productsPurchased || !userId || !cart || !email) {
                console.error("Error: Datos de compra no proporcionados");
                throw new Error("Datos de compra no proporcionados");
            }

            console.log("Estos son los productos comprados", totalAmount);


            const ticket = new TicketModel({

                userId: userId,
                ticketCode: Math.random().toString(36).substr(2, 9),
                amount: totalAmount,
                products: productsPurchased.map(item => ({

                    product: item.product._id,
                    item: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity
                })),
                purchaser: email
            })


            await ticket.save();
            console.log('ESTE ES EL TICKET CREADO', ticket)

            await this.sendTicketByEmail(cart, ticket, email);

            return ticket;

        } catch (error) {
            console.error("Error al crear   y enviar ticket:", error);
            throw new Error("Error al procesar el ticket de compra");
        }
    }

    async sendTicketByEmail(cart, ticket, email) {
        try {

            console.log("Este es el email del carrito", email);

            if (!email) {
                console.error("Error: El email del carrito no está definido");
                throw new Error("El email del carrito no está definido");
            }

            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER, //'joamilibarra@gmail.com'
                    pass: process.env.EMAIL_PASS // 'fegf owpo zprw zpwu'
                }

            });

            const productDetails = ticket.products.map(product => `
                <div>	
                                
                    <p>Producto: ${product.item}</p>
                    <p>Cantidad: ${product.quantity}</p>
                    <p>Precio: ${product.price}</p>
            </div>
            `).join('');


            let result = await transport.sendMail({
                from: 'joamilibarra@gmail.com',
                to: email,
                subject: 'Resumen de Compra',
                text: 'Gracias por su compra',
                html: `
                <div>
                <h1>Gracias por su compra</h1>
                    <p>Su ticket de compra ha sido generado con éxito.</p>
                    <h2>Detalles del Ticket</h2>
                    </div>
                    <div>
                    <p>Fecha de compra: ${ticket.createdAt.toLocaleDateString()
                    }</p >
                    <p>Id: ${ticket.userId}</p>
                    <p>Code: ${ticket.ticketCode}</p>                    
                    <p>Fecha de compra: ${ticket.createdAt.toLocaleDateString()}</p>
                    <p>Total de la compra: ${ticket.amount}</p>
                    <p>Comprador: ${ticket.purchaser}</p>
                    <p>${productDetails}</p>
                    </div>

`
            })

            console.log("Ticket enviado exitosamente por correo:", result);
            return result;


        } catch (error) {
            console.error("Error al intentar enviar ticket por memail:", error);
            throw new Error("Error al intentar enviar ticket por memail");
        }
    }
}

export default new TicketService();



