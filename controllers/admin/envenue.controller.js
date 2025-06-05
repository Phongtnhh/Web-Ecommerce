const Order = require("../../model/oder.model");
const systemConfig = require("../../config/system");

// [GET] admin/envenue
module.exports.index = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const filter = { deleted: false };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const orders = await Order.find(filter);

        let totalRevenue = 0;
        let totalOrders = orders.length;
        let totalProductsSold = 0;

        const revenueByProduct = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                const { product_id, price, discountPercentage, quantity } = product;
                const discountedPrice = price * (1 - discountPercentage / 100);
                const productRevenue = discountedPrice * quantity;

                totalRevenue += productRevenue;
                totalProductsSold += quantity;

                if (!revenueByProduct[product_id]) {
                    revenueByProduct[product_id] = {
                        totalRevenue: 0,
                        totalSold: 0
                    };
                }

                revenueByProduct[product_id].totalRevenue += productRevenue;
                revenueByProduct[product_id].totalSold += quantity;
            });
        });

        return res.json({
            revenueByProduct : revenueByProduct,
        }
        )
    } catch (error) {
        console.error("Error in envenue controller:", error);
        return res.status(500).send("Internal server error");
    }
};


