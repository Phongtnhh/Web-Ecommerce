const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] admin/product-category  
module.exports.index = async (req, res) => {
    if (req.role.permissions.includes("products-category_view")) {
        let find = {
            deleted: false,
        };

        const records = await ProductCategory.find(find);
        const newRecords = createTreeHelper.tree(records);
        console.log(newRecords);
        res.json(newRecords);
    } else {
        res.json({
            code: 400,
            massage: "Hong co quyen be oi",
        })
    }
}
// [GET] admin/product-category /creat
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    console.log(newRecords);
    res.json(newRecords);
}
// [POST] admin/product-category /create
module.exports.createPost = async (req, res) => {
    if (req.role.permissions.includes("products-category_create")) {
        if (!req.body.position || req.body.position === "") {
            const positionTmp = await ProductCategory.countDocuments();
            req.body.position = positionTmp + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const record = new ProductCategory(req.body);
        await record.save();
        res.json({
            code: 200,
            massage: "ahihihihihihi"
        });
    } else {
        res.json({
            code: 400,
            massage: "Hong co quyen be oi",
        })
    }

}


// [PATCH] admin/product-category /edit
module.exports.edit = async (req, res) => {
    if (req.role.permissions.includes("products-category_create")) {
        const id = req.body.id;

        req.body.position = parseInt(req.body.position);

        await ProductCategory.updateOne({
            _id: id
        }, req.body);
    }else{
        res.json({
            code : 200,
            massage: "khong co quyen!"
        })
    }
}

module.exports.deleted = async (req, res) => {
    if (req.role.permissions.includes("products-category_delete")) {
        const id = req.body.id;
        await ProductCategory.updateOne({
            _id: id
        }, {
            deleted : true,
        });
    }else{
        res.json({
            code : 200,
            massage: "khong co quyen!"
        })
    }
}


