const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] admin/product-category  
module.exports.index = async (req, res)=> {
    let find = {
        deleted : false,
    };

    const records = await ProductCategory.find(find);
    res.json(records);
}
// [GET] admin/product-category /creat
module.exports.create = async (req, res)=> {
    let find = {
        deleted : false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.json(newRecords);
}
// [POST] admin/product-category /create
module.exports.createPost = async (req, res)=> {
    if (!req.body.position || req.body.position === "") {
        const positionTmp = await ProductCategory.countDocuments();
        req.body.position = positionTmp + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/prodcucts-category`);
}


// [PATCH] admin/product-category /edit
module.exports.edit = async (req, res)=> {
    const id = req.body.id;
    
    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({_id : id}, req.body);
}