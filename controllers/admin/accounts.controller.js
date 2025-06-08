const Account = require("../../model/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] admin/accounts
module.exports.index = async (req, res)=> {
    let find = {
        deleted : false,
    };

    const records = await Account.find(find).select("-password -token");
    res.json(records);
}
// [POST] admin/account/create
module.exports.create = async (req, res)=> {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });

    if(emailExist){
        res.json({
            code : 400,
            message: "Email da ton tai"
        })
    }else{
        req.body.password = md5(req.body.password);
    
        const record = new Account(req.body);
        await record.save();
        res.json({
            code: 200,
            message: "Tạo tài khoản thành công"
        });
    } 
}

// [PATCH] admin/account/edit
module.exports.edit = async (req, res)=> {
    const id = req.body.id;
    const emailExist = await Account.findOne({
        _id : { $ne: id},
        email: req.body.email,
        deleted: false,
    });
    if(emailExist){
        res.json({
            code : 400,
            message: "Email da ton tai!"
        });
        return;
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }  
        
        await Account.updateOne({_id : id},req.body);
        res.json({
            code : 200,
            message: "cap nhap thanh cong!"
        })
    }
}