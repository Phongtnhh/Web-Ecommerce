const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");
const ProductCategoryHelper = require("../../helpers/product-category");
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

// [GET] product/:slugCategory
module.exports.category = async (req, res) => {
    try{
        const productCategory = ProductCategory.findOne({
            slug : req.params.slugCategory,
            deleted: false
        });

        
        const listSubCategory = await ProductCategoryHelper.getSubCategory(productCategory.id); 
        const listSubCategoryId = listSubCategory.map(item => item.id);

        const products = Product.find({
            product_category_id : {$in : [productCategory.id,...listSubCategoryId]},
            deleted : false,
        });

        res.json({
            code : 200,
            massage : "san pham theo danh muc",
            products : products 
        })
    }catch(error){
        
    }
    
}