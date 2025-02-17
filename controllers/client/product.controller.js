const Product = require("../../model/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status : "active",
        deleted: "false "
    });
     
    const newProducts =  products.map(item => {
        item.priceNew = item.price*((100-item.discountPercentage)/100).toFixe(0);
        return item;
    })

    res.json(newProducts);
}