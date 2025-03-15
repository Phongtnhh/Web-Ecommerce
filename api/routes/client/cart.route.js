const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/cart.controller");

router.get("/", controller.index );

router.post("/add", controller.addPost );

router.delete("/delete", controller.delete );

router.patch("/update-quantity", controller.updateQuantity );

module.exports = router;