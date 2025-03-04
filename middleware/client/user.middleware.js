const User = require("../../model/user.model");

module.exports.infoUser = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            tokenUser: token,
            deleted : false,
            status : "active"
        }).select("-password");
    }

    if(user){
        req.user = user;
    }
    next();
}