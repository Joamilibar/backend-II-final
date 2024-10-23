import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4(),  // Autogenerar un código único usando uuid
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,  // Guarda la fecha y hora exacta cuando se crea
        required: true
    },
    amount: {
        type: Number,
        required: true  // Total de la compra
    },
    purchaser: {
        type: String,
        required: true  // Correo del usuario asociado
    }
});