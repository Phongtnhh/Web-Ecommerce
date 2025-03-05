const mongoose = require("mongoose");

const forgotPassSchema = new mongoose.Schema(
    {
        email : String,
        otp : String,
        expiresAt : Date
    },
    {
        timestamps: true,
    }
);

const ForgotPass = mongoose.model("ForgotPass", forgotPassSchema, "forgot-password");

module.exports = ForgotPass;