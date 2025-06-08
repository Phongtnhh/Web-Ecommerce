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
        res.json(records);
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
            message: "ahihihihihihi"
        });
    } else {
        res.json({
            code: 400,
            message: "Hong co quyen be oi",
        })
    }

}


// [PATCH] admin/product-category /edit
module.exports.edit = async (req, res) => {
    if (req.role.permissions.includes("products-category_create")) {
        try {
            const id = req.body.id;
            req.body.position = parseInt(req.body.position);

            const result = await ProductCategory.updateOne({ _id: id }, req.body);

            if (result.modifiedCount > 0) {
                res.json({
                    code: 200,
                    message: "Cập nhật thành công!"
                });
            } else {
                res.json({
                    code: 200,
                    message: "Không có thay đổi nào được thực hiện."
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: "Đã xảy ra lỗi trong quá trình cập nhật.",
                error: error.message
            });
        }
    } else {
        res.json({
            code: 200,
            message: "Không có quyền!"
        });
    }
}


module.exports.deleted = async (req, res) => {
    if (req.role.permissions.includes("products-category_delete")) {
        const id = req.body.id;
        const result = await ProductCategory.updateOne({ _id: id }, { deleted: true });

        if (result.modifiedCount > 0) {
            res.json({ code: 200, message: "Xóa thành công" });
        } else {
            res.json({ code: 404, message: "Không tìm thấy danh mục hoặc đã bị xóa" });
        }
    } else {
        res.json({ code: 403, message: "Không có quyền!" });
    }
}