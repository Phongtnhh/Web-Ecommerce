const Role = require("../../model/role.model");

// [GET] /adim/role
module.exports.index = async (req, res) => {
    let find = {
        deleted : false,
    };

    const records = await Role.find(find);

    res.json(records);
}

// [GET] /adim/role/create
module.exports.create = async (req, res) => {

}

// [POST] /adim/role/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

}

// [PATCH] /adim/role/create
module.exports.edit = async (req, res) => {
    const id = req.body.id;
    
    await Role.updateOne({_id : id}, req.body);
}


// [PATCH] /adim/role/permission
module.exports.permission = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    for(const item of permissions){
        await Role.updateOne({_id : item.id}, {permissions: item.permissions});
    }
}