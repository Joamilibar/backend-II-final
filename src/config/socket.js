import { Server } from 'socket.io';

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';



const app = express();
const httpServer = http.createServer(app);
export const socketServer = new Server(httpServer);

export default class Socket {
    static init = async () => {

        socketServer.on('connection', async socket => {
            console.log('Nueva Conexión:', socket.id);


            // Listar productos en tiempo real
            const products = await prodFileManager.readFile();
            socketServer.emit('productUpdate', products);


            // Agregando nuevo producto
            socket.on('addProduct', async (newProduct) => {
                const products = await prodFileManager.readFile();
                products.push(newProduct);
                await prodFileManager.writeFile(products);

                // Actualizando para todos los clientes
                socketServer.emit('productUpdate', products);
            });

            socket.on('deleteProduct', async (productId) => {
                console.log('Eliminar producto con id', productId);

                // Eliminando producto de lista
                let products = await prodFileManager.readFile();
                products = products.filter(product => product.id !== parseInt(productId));
                await prodFileManager.writeFile(products);
                socketServer.emit('productDeleted', productId);
                socketServer.emit('updateProducts', products);

                // Actualizando para todos los clientes
                socketServer.emit('productUpdate', products);
            });



            socket.on('message', (data) => {
                messages.push(data);
                socketServer.emit('message', data);
                console.log(data);
            });


            socket.on('connect', () => {
                console.log('Conectado al servidor');
            });

            socket.on('connect_error', (error) => {
                console.error('Error de conexión:', error);
            });
        });
    }
};