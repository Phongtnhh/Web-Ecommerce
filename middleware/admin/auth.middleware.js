const Account = require("../../model/account.model");
const Role = require("../../model/role.model");
module.exports.requireAuth = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const account = await Account.findOne({
            token: token,
            deleted: false
        });

        if(!account){
            res.json({
                code: 403,
                message: "khong co quyen truy cap!"
            });
        }else{
            req.account = account;
            const role = await Role.findOne({
                _id : account.role_id
            });
            req.role = role;
            next();
        }
    } else{
        res.json({
            code: 403,
            message: "KHong co quyen truy cap!"
        });
    }
}