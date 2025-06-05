const Order = require("../../model/oder.model");
const systemConfig = require("../../config/system");

// [GET] admin/order
module.exports.index = async (req, res) => {
    const { startDate, endDate, status } = req.body;
        const filter = { deleted: false };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if(status){
            filter.status = status
        }
        const orders = await Order.find(filter);
        res.json({
            code : 200,
            orders : orders
        })

}

//
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    await Order.updateOne({
        _id : id 
    },{
        status: status,
    });
    res.json({
        code : 200,
        massage : "cap nhap thanh cong",
    })
}
