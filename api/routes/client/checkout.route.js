const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/checkout.controller");

router.post("/create_payment_url", controller.createOrder );


router.post("/refundVN", controller.refundOrder );
module.exports = router;