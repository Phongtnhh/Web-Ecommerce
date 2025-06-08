const User = require("../../model/user.model");
const jwt = require('jsonwebtoken');

module.exports.infoUser = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            email : decoded.email,
            deleted : false,
            status : "active"
        }).select("-password");
        if(!user){
            res.json({
                code: 403,
                message: "khong co quyen truy cap!"
            });
        }else{
            req.cartId = decoded.cartId,
            req.user = user;
            req.token = token;
            next();
        }
    }
    else{
        res.json({
            code: 403,
            message: "khong co quyen truy cap!"
        });
    }

    
}

