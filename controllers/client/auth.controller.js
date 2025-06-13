const User = require("../../model/user.model");
const Cart = require("../../model/cart.model");
const forgotPass= require("../../model/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const jwt = require("jsonwebtoken");

const md5 = require("md5");
const generate =  require("../../helpers/generate");

// [POST] auth/register
module.exports.register = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email,
        });

        if (existEmail) {
            return res.json({
                code: 400,
                message: "Email đã tồn tại!",
            });
        }

        // Mã hoá mật khẩu
        req.body.password = md5(req.body.password);

        // Tạo user mới
        const user = new User(req.body);
        await user.save();

        // Tạo cart rỗng tương ứng
        const emptyCart = new Cart({
            user_id: user._id.toString(),
            products: [],
        });
        await emptyCart.save();

        const token = user.tokenUser;

        return res.json({
            code: 200,
            token: token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ!",
        });
    }
};


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
    };

    const cart = await Cart.findOne({
            user_id : user.id
        })

    const payload = {
            user_id: user.id,
            email : req.body.email,
            cartId : cart.id
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
    res.json({
        code : 200,
        massage : "gửi otp thành công",
    })
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

    res.json({
        code : 200,
        user: user
    })
}

// [POST] auth/password/reset
module.exports.reset = async (req, res) => {
    const password = req.body.password;
    const id = req.body.id;

    await User.updateOne({
        _id : id,
    },{
        password : md5(password),
    })
    res.json({
        code : 200,
        message : "Thay đổi mật khẩu thành công",
    })
}