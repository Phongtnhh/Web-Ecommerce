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
    const { status, toadoaDon } = req.body;

    const updateData = {};

    if (status !== undefined) {
        updateData.status = status;
    }

    if (toadoaDon && toadoaDon.type === 'Point' && Array.isArray(toadoaDon.coordinates)) {
        updateData.toadoaDon = toadoaDon;
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            code: 400,
            message: "Không có dữ liệu hợp lệ để cập nhật",
        });
    }

    try {
        await Order.updateOne({ _id: id }, updateData);
        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Lỗi khi cập nhật đơn hàng",
            error: error.message,
        });
    }
}
