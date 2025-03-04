const ProductCategory = require("../../model/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
    let find = {
        deleted : false
    }
    const ProductsCategory = await ProductCategory.find(find);
    const newProductsCategory  = createTreeHelper.tree(ProductsCategory);
    req.newProductsCategory = newProductsCategory;
    next();
}