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

// [POST] /adim/role/create
module.exports.createPost = async (req, res) => {
    if(req.role.permissions.includes("change-roles")){
        const record = new Role(req.body);
        await record.save();
    }else{
        res.json({
            code : 404,
            massgae : "khong co quyen truy cap!"
        })
    }
}

// [PATCH] /adim/role/edit
module.exports.edit = async (req, res) => {
    const id = req.body.id;
    
    await Role.updateOne({_id : id}, req.body);
}


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