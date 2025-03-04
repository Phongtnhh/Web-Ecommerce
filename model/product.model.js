const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title : String,
    description : String,
    product_category_id : {
        type : String,
        default : ""
    },
    price : Number,
    discountPercentage : Number,
    stock : Number,
    thumbnail : String,
    status : String,
    featurned : String,
    position : Number,
    slug: {
        type : String,
        slug : "title",
        unique : true
    },
    createBy: {
        account_id : String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted : {
        type : Boolean,
        default : false
    },
    deleteBy:{
        account_id: String,
        deleteAt: {
            type: Date,
            default: Date.now 
        }
    },
    updatedBy:[{
            account_id: String,
            updateAt: {
                type: Date,
                default: Date.now 
        }
    }]
},
{
    timestamps : true,
});

const Product = mongoose.model("Product",productSchema, "products");

module.exports = Product;


