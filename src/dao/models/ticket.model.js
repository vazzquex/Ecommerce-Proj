import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        },
    }]
}, 
{
    timestamps: true,
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;
