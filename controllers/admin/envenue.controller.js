const Order = require("../../model/oder.model");
const systemConfig = require("../../config/system");
const Product = require("../../model/product.model");

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

        const revenueMap = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                const { product_id, price, discountPercentage, quantity } = product;
                const discountedPrice = price * (1 - discountPercentage / 100);
                const productRevenue = discountedPrice * quantity;

                totalRevenue += productRevenue;
                totalProductsSold += quantity;

                if (!revenueMap[product_id]) {
                    revenueMap[product_id] = {
                        productId: product_id,
                        totalRevenue: 0,
                        totalSold: 0,
                    };
                }

                revenueMap[product_id].totalRevenue += productRevenue;
                revenueMap[product_id].totalSold += quantity;
            });
        });

        const productIds = Object.keys(revenueMap);

        const products = await Product.find({ _id: { $in: productIds } });

        const revenueByProduct = products.map(product => {
            const data = revenueMap[product._id];
            return {
                productId: product._id,
                title: product.title,
                thumbnail: product.thumbnail,
                totalRevenue: data.totalRevenue,
                totalSold: data.totalSold
            };
        });

        return res.json({
            revenueByProduct
        });
    } catch (error) {
        console.error("Error in revenue controller:", error);
        return res.status(500).send("Internal server error");
    }
};
