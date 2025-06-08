const categoryMiddleware = require("../../../middleware/client/category.middleware");
const cartMiddleware = require("../../../middleware/client/cart.middleware");
const userMiddleware = require("../../../middleware/client/user.middleware");

const searchRoute = require("./search.route");
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
 
    app.use(cartMiddleware.cartId);
    
    app.use("/", homeRoutes );
    app.use("/products", productRoutes);
    app.use("/search", searchRoute);
    app.use("/cart",userMiddleware.infoUser, cartRoute);
    app.use("/checkout",userMiddleware.infoUser, checkoutRoute);
    app.use("/auth", authRoute);
    app.use("/order",userMiddleware.infoUser, orderRoute);
    app.use("/user",userMiddleware.infoUser, userRoute);

}
