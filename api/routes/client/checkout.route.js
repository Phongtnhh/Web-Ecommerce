const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/checkout.controller");

router.get("/", controller.index );
router.post("/create_payment_url", controller.createPaymentUrl );
module.exports = router;