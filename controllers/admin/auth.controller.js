const Account = require("../../model/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [Post] admin/auth/login
module.exports.login = async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const record = await Account.findOne({
        email : email,
        deleted : false
    });

    if(!record){
        res.json({
            code: 400,
            message: "Email da ton tai"
        });
        return;
    }

    if(md5(password) !== record.password ){
        res.json({
            code: 400,
            message : "sai mat khau"
        });
        return;
    }

    const token = record.token;
    res.json({
        code: 200,
        message : "dang nhap thanh cong",
        token : token
    })
}


// [GET]
module.exports.logout= async (req, res)=> {
    res.clearCookie("token");
}
