const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");

// [GET] cart
module.exports.index = async (req, res) => {
    const cartId = req.cartId;
    let cart = await Cart.findOne({
        _id : cartId,
    });
    if(cart.products.length > 0){
        for(let item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id : productId,
            }).select("title thumbnail slug price");

            if (productInfo) {
                item.productInfo = {...productInfo};
                totalPrice = productInfo.price * item.quantity;
            }

            var _item = {...item, productInfo, totalPrice}
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
    const cartId = req.cartId;

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
        res.json({
            code : 200,
            massage : "thanh cong"
        })
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

        res.json({
            code : 200,
            massage : "thanh cong"
        })
    }

    
};  

// [POST] cart/delete
module.exports.delete = async (req, res) => {
    const cartId = req.cartId;
    const productIds = req.body.productIds; // Giả sử là mảng các productId

    if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
            code: 400,
            message: "Danh sách productIds không hợp lệ",
        });
    }

    try {
        await Cart.updateOne(
            { _id: cartId },
            {
                $pull: {
                    products: {
                        product_id: { $in: productIds },
                    },
                },
            }
        );

        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ khi xóa sản phẩm",
        });
    }
};


// [POST] cart/update-quantity
module.exports.updateQuantity = async (req, res) => {
    const cartId = req.cartId;
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
    res.json({
        code : 200,
        massage : "update thanh cong"
    }
    )
}; 