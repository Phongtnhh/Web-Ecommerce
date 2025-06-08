const { findByIdAndDelete } = require("../../model/account.model");
const Role = require("../../model/role.model");

// [GET] /admin/role
module.exports.index = async (req, res) => {
    if(req.role.permissions.includes("view-roles"))
        {let find = {
            deleted : false,
        };

        const records = await Role.find(find);
        const result = {
            code : 200,
            massgae : "thanh cong truy cap",
            records : records
        }
        res.json(result);
    }else{
        res.json({
            code : 404,
            massgae : "khong co quyen truy cap!"
        })
    }
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
    if(req.role.permissions.includes("change-roles")){
        try {
            const record = new Role(req.body);
            await record.save();
            res.json({
                code: 200,
                message: "Role created successfully!"
            });
        } catch (error) {
            res.json({
                code: 500,
                message: "Error occurred while creating role",
                error: error.message
            });
        }
    } else {
        res.json({
            code: 404,
            message: "You do not have permission to access this resource!"
        });
    }
};

// [PATCH] /adim/role/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.json({ code: 400, message: "ID is required" });
        }

        const result = await Role.updateOne({ _id: id }, req.body);

        if (result.matchedCount === 0) {
            return res.json({ code: 404, message: "Role not found" });
        }

        if (result.modifiedCount > 0) {
            return res.json({ code: 200, message: "Role updated successfully" });
        } else {
            return res.json({ code: 200, message: "No changes made" });
        }
    } catch (error) {
        console.error("Error updating role:", error);
        return res.json({ code: 500, message: "Internal server error" });
    }
};

// [PATCH] /adim/role/permission
module.exports.permission = async (req, res) => {
    if(req.role.permissions.includes("change-roles")){
        const permissions = req.body.permissions;
        console.log(permissions);
        for(const item of permissions){
            await Role.updateOne({_id : item.id}, {permissions: item.permissions});
        }
    }
}