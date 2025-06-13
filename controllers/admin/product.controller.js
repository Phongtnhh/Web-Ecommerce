const Product = require("../../model/product.model");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../model/product-category.model");
const mongoose = require('mongoose');
// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = "req.query.sortValue";
    }else{
        sort.position = "asc";
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

    const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

    const productsJson = products.map(item => {
        return item
    });

    const result = {
        products: productsJson,
        keyword: req.query.keyword,
        currentPage: objectPagination.currentPage
    }

    res.json(result);
}


// [GET] /admin/products/:slugcategory
module.exports.category = async (req, res) => {
    try{
        const productCategory = await ProductCategory.findOne({
            slug : req.params.slugCategory,
            deleted: false,
            status : "active"
        });
        const products = await Product.find({
            product_category_id : productCategory.id,
            deleted : false,
        }).sort({ position: "desc"});

        res.json({
            code : 200,
            massage : "san pham theo danh muc",
            products : products 
        })
    }catch(error){
        res.json({
            code : 404,
            massage : "loi"
        })
    }
    
}

// [PATCH] /admin/products/change-status
module.exports.changeStatus = async (req, res) => {
    const id = req.body.id;
    const status = req.body.status;
    const updatedBy = {
        account_id: req.account.id,
        updateAt : new Date()
    }
    console.log(req.body);
    await Product.updateOne({
        _id: id
    }, {
        status: status,
        $push: {updatedBy : updatedBy}
    });

    res.json({
        code: 200,
        message: "thay doi thanh cong!"
    })
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    const updatedBy = {
        account_id: req.account.id,
        updateAt : new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push: {updatedBy : updatedBy}
            });
            break;

        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push: {updatedBy : updatedBy}
            });
            break;

        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids,
                    }
            }, {
                deleted: true,
                deleteBy: {
                    account_id : req.account.id,
                    deletedAt: new Date()
                }
            });
            break;
        default:
            break;
    }
}

// [PATCH] /admin/products/deleteItem
module.exports.deleteItem = async (req, res) => {
    const id = req.body.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: "true",
        deletedby : {
            account_id : req.account.id,
            deleteAt : new Date()
        }
    });
    res.json({
        code: 200,
        message: "xoa thanh cong!",
    })
}

// [POST] /admin/products/createPost
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (!req.body.position || req.body.position === "") {
        const positionTmp = await Product.countDocuments();
        req.body.position = positionTmp + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    product.save();
    res.json({
        code : 200,
        message : "them thanh cong",
    })

}

// [GET] /admi/products/edit/:slug
module.exports.edit = async (req, res) => {
    const product = await Product.findOne({
        slug: req.params.slug
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
}

// [PATCH] /admin/products/edit
module.exports.editPatch = async (req, res) => {
    const id = req.body.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    console.log(req.body);
    try {
        const updatedBy = {
            account_id : req.account.id,
            updatedAt : new Date()
        }

        const result = await Product.updateOne(
            { _id: id }, 
            { 
                ...req.body, 
                $push: { updatedBy: updatedBy } 
            }
        );
        res.json({
            code : 200,
            message: "Cap nhap thanh cong!",
        })
    } catch (error) {
        res.json({
            code : 400,
            message: "Cap nhap that bai!",
        })
    }

}

// [GET] /admin/products/detail/:slug
module.exports.detailItem = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug
        };

        const product = await Product.findOne(find);

        res.json(product);
    } catch (error) {
        req.flash("error", "that bai");
        res.redirect(`${systemConfig.prefixAdmin}/prodcucts`);
    }
}