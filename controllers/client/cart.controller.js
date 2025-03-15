const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");

// [GET] cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id : cartId,
    });
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id : productId,
            }).select("title thumbnail slug price");

            
            item.productInfo = productInfo;
            item.totalPrice = productInfo.price * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    const result = {
        code : 200,
        cart : cart
    }
    res.json(result);
}; 

// [POST] cart/add
module.exports.addPost = async (req, res) => {
    const productId =  req.body.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductInCart = cart.products.find(item => item.product_id == productId);

    if(existProductInCart){
        const quantityNew = quantity + existProductInCart.quantity;

        await Cart.updateOne({
            _id: cartId,
            "products.product_id" : productId   
        }, {
            $set: {
                "products.$.quantity" : quantityNew
            }
        });
    }else{
        const objectCart = {
            product_id : productId,
            quantity: quantity
        };
    
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push : {products: objectCart}
            }
        );
    }

    
};  

// [POST] cart/delete
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId =  req.body.productId;

    await Cart.updateOne({
        _id : cartId,
    },{
        $pull: {products : {product_id : productId}}
    })

    res.json({
        code: 200,
        massage : "xoa thanh cong",
    })
    
}; 

// [POST] cart/update-quantity
module.exports.updateQuantity = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    await Cart.updateOne({
        _id : cartId,
        "products.product_id" : productId,
    },{
        $set : {
            "products.$.quantity" : quantity,
        },
    });
}; 