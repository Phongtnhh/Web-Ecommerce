const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");
const Oder = require("../../model/oder.model");
// [GET] checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = Cart.find({
        _id : cartId,
    })

    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _Id : productId,
            }).select("title thumbnail slug price");

            item.productInfo = productInfo;

            item.totalPrice = productInfo.price * productInfo.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.json({
        code : 200,
        cart : cart,
    })
}


// [POST] checkout/oder
module.exports.oder = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id : cartId,
    });

    const products = [];

    for(product of cart.products){
        const objectProduct = {
            product_id: product.product_id,
            price: product.price,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Product.findOne({
            _id: product.product_id 
        }).select("price discountPercentage");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(userInfo);
    }

    const orderInfo = {
        cartId: cartId,
        userInfo: userInfo,
        products: products,
    };

    const order = new Oder(orderInfo);
    order.save();

    await Cart.updateOne({
        _id : cartId,
    },{
        products : [],
    });
    
}