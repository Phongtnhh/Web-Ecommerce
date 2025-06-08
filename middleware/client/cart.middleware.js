const Cart = require("../../model/cart.model");
module.exports.cartId = async (req, res, next) => {
    if(req.body.cartId){
        const cart = await Cart.findOne({
            _id: req.body.cartId
        });
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        req.miniCart = cart;
    }
    next();
}