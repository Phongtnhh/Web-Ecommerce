const Product = require("../../model/product.model");


// [GET] /admin/products
module.exports.index = async (req, res) => {

    
    let find = {
        deleted : false
    };

    if(req.query.status){
        find.status = req.query.status;
    };

    let keyword = "";

    if(req.query.keyword){
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    const products = await Product.find(find);
    
    const productsJson = products.map(item => {return item});

    res.json(productsJson);
}