const Product = require("../../model/product.model");

// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    if(keyword){
        
        const regex = RegExp(keyword, "i");
        const products = await Product.find({
            title: regex,
            deleted : false,
            status : "active"
        });
        res.json({
            code : 200,
            products : products,
            keyword : keyword,
        });
    }
}
