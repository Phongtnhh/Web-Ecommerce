const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/cart.controller");

router.get("/", controller.index );

router.post("/add", controller.addPost );

router.get("/delete", controller.delete );

router.get("/update-quantity", controller.updateQuantity );

module.exports = router;