import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ticketsService from "../services/tickets.service.js";

dotenv.config();



export default class MailController {
    static sendMail = async (req, res) => {
        try {
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: env.example.EMAIL_USER,
                    pass: env.example.EMAIL_PASS
                }

            });

            let result = await transport.sendMail({
                from: 'joamilibarra@gmail.com',
                to: 'joamilibarra@gmail.com',
                subject: 'Resumen de Compra',
                text: 'Gracias por su compra',
                html: `
                <h1>Su compra ha sido exitosa</h1>
                <h2>Resumen de su compra</h2>
                <p>Productos:</p>
                

`
            })




            res.send(result);

        } catch (error) {
            console.error("Error al enviar el email:", error);
            return res.status(500).json({ message: "Error al enviar el email" });
        }
    }
}