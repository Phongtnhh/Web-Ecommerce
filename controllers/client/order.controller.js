const Order = require("../../model/oder.model");
const systemConfig = require("../../config/system");
//[POST] /oder
module.exports.postOder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {
            status,
            userInfo,
            products
        } = req.body;
        if (
            !user_id ||
            !userInfo ||
            !userInfo.fullName ||
            !userInfo.phone ||
            !userInfo.address ||
            !userInfo.toadoa ||
            !Array.isArray(userInfo.toadoa.coordinates) ||
            userInfo.toadoa.coordinates.length !== 2 ||
            !Array.isArray(products) ||
            products.length === 0
            ) {
            return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
            }


        const newOrder = new Order({
            user_id,
            status: status || 'pending', 
            userInfo: {
                fullName: userInfo.fullName,
                phone: userInfo.phone,
                address: userInfo.address,
                toadoa: {
                    type: 'Point',
                    coordinates: userInfo.toadoa.coordinates
                }
            },
            products,
            deleted: false
        });

        const savedOrder = await newOrder.save();
        return res.status(201).json({ message: 'Đặt hàng thành công', order: savedOrder });

    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

module.exports.view = async (req, res) => {
    const id = req.user.id;
    console.log(id);
    const record = await Order.findOne({
        user_id : id,
    })
   res.json({ 
        code : 200,
        order : record,
   }
   )
};

module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Order.findOne({
        _id : id,
    })
   res.json({ 
        code : 200,
        order : record,
   }
   )
};