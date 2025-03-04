const Product = require("../../model/product.model");

// [GET] client/home
module.exports.index = async (req, res) => {
    let find = {
        deleted : false,
    };
    const product =  await Product.find(find).sort({position: 1});
    res.json({
        code : 200,
        products : product
    })
};  