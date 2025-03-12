const Setting = require("../../model/setting.model");

// [GET] /adim/setting
module.exports.index = async (req, res) => {
    const setting = await Setting.findOne({});

    res.json({
        code : 200,
        setting: setting
    })
}

// [Patch] /admin/setting/general
module.exports.general = async (req, res) => {

    const settingGeneral = new Setting(req.body);
    await settingGeneral.save();
}