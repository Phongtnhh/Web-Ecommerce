const categoryMiddleware = require("../../../middleware/client/category.middleware");
const cartMiddleware = require("../../../middleware/client/cart.middleware");
const searchRoute = require("./search.route");
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const authRoute = require("./auth.route");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    // app.use(cartMiddleware.cartId);
    
    app.use("/", homeRoutes );
    app.use("/products", productRoutes);
    app.use("/search", searchRoute);
    app.use("/cart", cartRoute);
    app.use("/checkout", checkoutRoute);
    app.use("/auth", authRoute);
}
