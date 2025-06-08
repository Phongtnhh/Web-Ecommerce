const express = require('express');
const crypto = require('crypto');

//VNPAY
// Thanh toán VNPAY
module.exports.createOrder = (req, res) => {
    const { total, orderInfo, returnUrl } = req.body;
    if (!total || !orderInfo || !returnUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const paymentUrl = createOrder(total, orderInfo, returnUrl);
        res.json({ paymentUrl });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

function createOrder(total, orderInfor, urlReturn) {
    const amount = total * 100;
    const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: "705XTMKT",
        vnp_Amount: amount.toString(),
        vnp_CurrCode: "VND",
        vnp_TxnRef: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        vnp_OrderInfo: orderInfor,
        vnp_OrderType: "other-type",
        vnp_Locale: "vn",
        vnp_ReturnUrl: `${urlReturn}/api/v1/vnpay/payment`,
        vnp_IpAddr: "127.0.0.1"
    };

    const date = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const formatDate = (d) => {
        return d.getFullYear().toString() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) +
            pad(d.getHours()) +
            pad(d.getMinutes()) +
            pad(d.getSeconds());
    };

    vnp_Params["vnp_CreateDate"] = formatDate(date);
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000);
    vnp_Params["vnp_ExpireDate"] = formatDate(expireDate);

    const sortedKeys = Object.keys(vnp_Params).sort();
    const hashData = sortedKeys.map(key =>
        `${key}=${encodeURIComponent(vnp_Params[key])}`
    ).join('&');

    const query = sortedKeys.map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(vnp_Params[key])}`
    ).join('&');

    const vnp_SecureHash = hmacSHA512("M1B47R8AH8LE8NSF5JMOB6CEDFT5844K", hashData);
    const queryUrl = query + `&vnp_SecureHash=${vnp_SecureHash}`;

    return `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryUrl}`;
}

function hmacSHA512(secret, data) {
    return crypto.createHmac('sha512', secret)
        .update(data, 'utf8')
        .digest('hex');
}

// Refund VNPAY
function createRefund(txnRef, amount, transactionNo, user, refundType, ipAddr) {
    const secretKey = "M1B47R8AH8LE8NSF5JMOB6CEDFT5844K";
    const vnp_TmnCode = "705XTMKT";
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, '0');
    const formatDate = (d) => {
        return d.getFullYear().toString() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) +
            pad(d.getHours()) +
            pad(d.getMinutes()) +
            pad(d.getSeconds());
    };

    const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "refund",
        vnp_TmnCode: vnp_TmnCode,
        vnp_TxnRef: txnRef,
        vnp_Amount: (amount * 100).toString(),
        vnp_OrderInfo: `Hoan tien cho giao dich ${txnRef}`,
        vnp_TransactionDate: formatDate(now),
        vnp_CreateBy: user,
        vnp_TransactionNo: transactionNo,
        vnp_RefundType: refundType, // "02" (partial) hoặc "01" (full)
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: formatDate(now)
    };

    const sortedKeys = Object.keys(vnp_Params).sort();
    const hashData = sortedKeys.map(key =>
        `${key}=${encodeURIComponent(vnp_Params[key])}`
    ).join('&');

    const vnp_SecureHash = hmacSHA512(secretKey, hashData);
    vnp_Params.vnp_SecureHash = vnp_SecureHash;

    // Gửi request đến VNPay bằng thư viện axios hoặc fetch
    // API này sẽ gọi đến VNPay backend URL (bạn cần lấy từ tài liệu kỹ thuật VNPay)
    return vnp_Params; // Tùy bạn xử lý gửi đi hay chỉ trả về
}
module.exports.refundOrder = (req, res) => {
    const { txnRef, amount, transactionNo, user, refundType, ipAddr } = req.body;

    if (!txnRef || !amount || !transactionNo || !user || !refundType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const refundUrl = createRefund(txnRef, amount, transactionNo, user, refundType, ipAddr || '127.0.0.1');
        res.json({ refundUrl });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
