const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
                productInfo: {
                    _id: String,
                    title: String,
                    thumbnail: String,
                    slug: String,
                    price: Number,
                    discountPercentage: Number
                },
                totalPrice: Number
            }
        ],
        totalPrice: Number
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;