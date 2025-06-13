const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema(
    {
        user_id: String,
        status : String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
            toadoa: {
                type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
                },
                coordinates: {
                type: [Number],  
                required: true
                } 
            }
        },
        toadoaDon: {
                type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
                },
                coordinates: {
                type: [Number],  
                required: true
                } 
            },
        products: [
            {
                product_id: String,
                title : String,
                thumbnail : String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt : Date,
    },
    {
        timestamps: true,
    }
);

const Oder = mongoose.model("Oder", oderSchema, "oders");

module.exports = Oder;