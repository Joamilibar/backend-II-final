import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                }


            }

        ],
        default: []
    },
    timestamp: { type: Date, default: Date.now, required: true }
});

cartSchema.plugin(mongoosePaginate);

const CartModel = mongoose.model(cartCollection, cartSchema);


export default CartModel;