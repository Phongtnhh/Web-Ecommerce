const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/checkout.controller");

router.get("/", controller.index );
router.post("/oder", controller.oder );
module.exports = router;