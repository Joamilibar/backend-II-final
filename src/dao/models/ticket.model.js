import mongoose from 'mongoose';
import pkg from 'uuidv4';
import ProductModel from './product.model.js';
import UserModel from './user.model.js';

const { v4 } = pkg;

const ticketCollection = 'Tickets';

const ticketSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketCode: {
        type: String,
        required: true,
        default: v4
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        item: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    purchaser: {
        type: String,
        ref: 'Email',
        required: true
    },
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);
export default TicketModel;
