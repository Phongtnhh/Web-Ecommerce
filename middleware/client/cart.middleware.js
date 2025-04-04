const Cart = require("../../model/cart.model");
module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart();
        cart.save();

        const expiresCookie = 365 * 24 * 60 * 60;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });
    }else{
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });

        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        
        req.miniCart = cart;
        
    }
    next();
}