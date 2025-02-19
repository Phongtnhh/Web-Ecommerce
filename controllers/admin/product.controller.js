const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    };

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    // Phan trang
    const countProducts = await Product.find(find);
    let objectPagination = paginationHelper({
        currentPage : 1,
        limitItem: 4
    },
    req.query,
    countProducts
    );

    

    
    // End Phan trang

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    const productsJson = products.map(item => {
        return item
    });

    const result = {
        products : productsJson,
        keyword : req.query.keyword,
        limit : objectPagination.currentPage
    }

    res.json(result);
}