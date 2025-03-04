const User = require("../../model/user.model");
const md5 = require("md5");

// [POST] auth/logout
module.exports.logout = async (req, res) => {
}

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
    console.log(md5(password));
    if(md5(password) !== user.password) {
        
        res.json({
            code : 200,
            massage : "Sai mat khau!"
        })
        return;
    }

    if(user.status === "locked") {
        res.json({
            code : 200,
            massage : "tai khoan dang bi khoa!"
        })
        return;
    }

    const token = user.tokenUser;
    res.json({
        code : 200,
        massage: "khi ban thay tin nhan nay, ban da dang nhap thanh cong",
        token : token,
    })
}