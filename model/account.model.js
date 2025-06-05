const mongoose = require("mongoose");
const generate = require("../helpers/generate");


const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    role_id : {
        type: String,
        default : "",
    },
    status: String,
    deleted : {
        type : Boolean,
        default : false
    },
    deletedAt : Date
},
{
    timestamps : true,
});

const Account = mongoose.model("Acount",accountSchema, "accounts");

module.exports = Account;


