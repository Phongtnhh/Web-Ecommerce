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
        req.flash("error", "email da ton tai");
        res.redirect("back");
    }else{
        req.body.password = md5(req.body.password);
    
        const record = new Account(req.body);
        await record.save();
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
        req.flash("error", "email da ton tai");
        res.redirect("back");
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }  
        
        await Account.updateOne({_id : id},req.body);
        req.flash("success","cap nhap thanh cong");
    }
    res.redirect("back");
}