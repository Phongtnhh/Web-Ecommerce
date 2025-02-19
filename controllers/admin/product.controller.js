const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    let sort = {
        position : "decs"
    }

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
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );
    // End Phan trang

    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip);

    const productsJson = products.map(item => {
        return item
    });

    const result = {
        products: productsJson,
        keyword: req.query.keyword,
        currentPage: objectPagination.currentPage
    }

    console.log(result);

    res.json(result);
}

// [PATCH] /admin/products/change-status
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne({
        _id: id
    }, {
        status: status
    });

    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            });
            break;

        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            });
            break;

        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            });

        default:
            break;
    }
}

// [PATCH] /admin/products/deleteItem
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: "true",
        deletedAt: new Date()
    });

    res.redirect("back");
}

