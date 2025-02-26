const Account = require("../../model/account.model");
const md5 = require("md5");
// [GET] admin/myaccout
module.exports.index = (req, res) => {
    res.json({
        code : 400,
        massage : "du lieu nguoi dung",
        account : req.account
    })
}

// [PATCH] admin/myaccout/edit
module.exports.edit = async (req, res) => {
    const id = req.account.id;

    const existEmail = await Account.findOne({
        _id : { $ne: id},
        email : req.body.email,
        deleted : false

    });
    if(existEmail){
        res.json({
            code : 400,
            massage: "Email da toan tai!"
        })
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }  
        
        await Account.updateOne({_id : id},req.body);
        res.json({
            code : 200,
            massage: "cap nhap thanh cong!"
        })
    }
    
}