const Product = require("../../model/product.model");

// [GET] user/info
module.exports.info = async (req, res) => {
   const tokenUser = req.user.tokenUser;
   console.log(tokenUser);
   res.json({
    code : 200,
    user : req.user,
   })
};  