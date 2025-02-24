const Product = require("../../model/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status : "active",
        deleted: "false"
    }).sort({position : "desc"});
     
    const newProducts =  products.map(item => {
        item.priceNew = item.price*((100-item.discountPercentage)/100).toFixed(0);
        return item;
    })

    res.json(newProducts);
}

// [GET] product/:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
            status : "active",
            deleted: "false",
            slug : req.params.slug
        };
        
        const product = await  Product.findOne(find);
        res.json(product);
    }catch(error){
        req.flash("error", "loi truy cap!");
        res.redirect("/products");
    }
    
}