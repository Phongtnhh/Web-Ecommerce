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
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
            currentPage: 1,
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

    req.flash("success", "Cập nhập trạng thái thành công!");

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
    req.flash("Success", "Đã xóa sản phẩm thành công!");
    res.redirect("back");
}

// [POST] /admin/products/createPost
module.exports.createPost  = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (!req.body.position || req.body.position === "") {
        const positionTmp = await Product.countDocuments(); 
        req.body.position = positionTmp + 1;
    } else {
        req.body.position = parseInt(req.body.position);
        if (Number.isNaN(req.body.position)) {
            
        }
    }

    const product = new Product(req.body);
    console.log(product);
    product.save();

}

