const User = require("../../model/user.model");
const Cart = require("../../model/cart.model");
const forgotPass= require("../../model/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const jwt = require("jsonwebtoken");

const md5 = require("md5");
const generate =  require("../../helpers/generate");

// [POST] auth/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email : req.body.email,
    });

    if(existEmail){
        res.json({
            code: 400,
            message: "Email da ton tai!"
        })
        return;
    }else{
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        const token = user.tokenUser;
        res.json({
            code : 200,
            token: token,
        })
    }
    
}

// [POST] auth/login
module.exports.login = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email : email,
        deleted : false
    });
    if(!user){
        res.json({
            code : 400,
            massage: "email khong chinh xac!"
        })
        return
    }
    if(md5(password) !== user.password) {
        
        res.json({
            code : 200,
            massage : "Sai mat khau!"
        })
        return;
    }

    if(user.status === "inactive") {
        res.json({
            code : 200,
            massage : "tai khoan dang bi khoa!"
        })
        return;
    }

    const cart = await Cart.findOne({
       user_id: user.id
    });

    if(cart){
        res.cookie("cartId", cart.id);
    }else{
        await Cart.updateOne({
            _id : req.cookies.cartId,
        },{
            user_id: user.id,
        });
    }
    const payload = {
            email : req.body.email,
            password : req.body.password,
        };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.json({
        code : 200,
        massage: "khi ban thay tin nhan nay, ban da dang nhap thanh cong",
        token : token,
    })
}

// [POST] auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.clearCookie('cartId', { path: '/' });

    res.status(200).json({ message: "Logout successful" });
};



// [POST] auth/password/forgot
module.exports.forgotPass = async (req, res) => {
    const email = req.body.email;
    
    const user = await User.findOne({
        email: email,
        deleted : false
    });
    if(!user){
        res.json({
            code : 400,
            massage : "email hong ton tai be oi"
        })
        return;
    }

    const objectFotgotPass = {
        email : email,
        otp : generate.generateRandomString(6),
        expiresAt : Date.now() + 10*60*1000,
    }
    const forgotPassword = new forgotPass(objectFotgotPass);
    forgotPassword.save();

    subject = "Ma OTP xac minh lay lai mat khau";
    html = `
        Ma OTP la <b>${objectFotgotPass.otp}</b>
    `;
    sendMailHelper.sendMail(email, subject, html);
}

// [POST] auth/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email;
    const otp = req.body.otp;

    const result = await forgotPass.findOne({
        email : email,
        otp : otp,
    });
    
    if(!result){
        res.json({
            code : 400,
            massage: "OTP khong hop le"
        })
        return;
    }

    const user = await User.findOne({
        email: email,
    });

    res.cookies("tokenUser", user.tokenUser);
    res.json({
        code : 200,
        token: user.tokenUser,
    })
}

// [POST] auth/password/reset
module.exports.reset = async (req, res) => {
    const password = req.body.password;
    const token = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: token
    },{
        password : md5(password),
    })
    res.json({
        code : 200,

    })
}