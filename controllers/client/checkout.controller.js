const Product = require("../../model/product.model");
const Cart = require("../../model/cart.model");
const Oder = require("../../model/oder.model");
const qs = require('qs');
const crypto = require('crypto');
// [GET] checkout
module.exports.index = async (req, res) => {
    const cartId = req.body.cartId;
    console.log(cartId);
    const cart = Cart.findOne({
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
// Hàm định dạng ngày theo yyyymmddHHmmss
function formatDate(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}

// Hàm sắp xếp các key object theo thứ tự alphabet
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

module.exports.createPaymentUrl = async (req, res) => {
  var ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  var tmnCode = process.env.VNP_TMNCODE;
  var secretKey = process.env.VNP_HASH_SECRET;
  var vnpUrl = process.env.VNP_URL;
  var returnUrl = process.env.VNP_RETURN_URL;

  var date = new Date();
  var createDate = formatDate(date); // sử dụng hàm formatDate thay vì dateFormat
  var orderId = String(date.getHours()).padStart(2, '0') +
                String(date.getMinutes()).padStart(2, '0') +
                String(date.getSeconds()).padStart(2, '0');

  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language || 'vn';
  var currCode = 'VND';

  var vnp_Params = {
    'vnp_Version': '2.1.0',
    'vnp_Command': 'pay',
    'vnp_TmnCode': tmnCode,
    'vnp_Locale': locale,
    'vnp_CurrCode': currCode,
    'vnp_TxnRef': orderId,
    'vnp_OrderInfo': orderInfo,
    'vnp_OrderType': orderType,
    'vnp_Amount': amount * 100,
    'vnp_ReturnUrl': returnUrl,
    'vnp_IpAddr': ipAddr,
    'vnp_CreateDate': createDate
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: false });

  res.redirect(paymentUrl);
};
